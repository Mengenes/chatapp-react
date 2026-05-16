import { Server } from "socket.io";
import { pool } from "../configs/db.ts";
import { socketAuth } from "../middlewares/socketAuth.ts";
import type { Server as HttpServer } from "http";

type ChatCallback = (res: {
  status: "ok" | "error";
  message?: string | object;
}) => void;

const messageTimestamps = new Map<string, number>();
const RATE_LIMIT_MS = 1500;

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", async (socket) => {
    const user = socket.data.user;

    let userInfo = user;

    if (user) {
      try {
        const res = await pool.query(
          "SELECT username FROM users WHERE id=$1",
          [user.id]
        );

        if (res.rows.length > 0) {
          userInfo = { ...user, username: res.rows[0].username };
          socket.data.user = userInfo;

          const userRoom = `user_${userInfo.id}`;
          socket.join(userRoom);

          await pool.query(
            "UPDATE users SET is_online = true WHERE id=$1",
            [user.id]
          );

          io.emit("presence-update", {
            userId: userInfo.id,
            username: userInfo.username,
            isOnline: true,
          });
        }
      } catch (err) {
        console.error("Error fetching username or updating status:", err);
      }
    }

    socket.on(
      "chat_message",
      async ({ message }: { message: string }, callback?: ChatCallback) => {
        const now = Date.now();
        const last = messageTimestamps.get(socket.id) ?? 0;

        if (now - last < RATE_LIMIT_MS) {
          return callback?.({ status: "error", message: "You are sending too fast." });
        }

        messageTimestamps.set(socket.id, now);

        try {
          if (!userInfo) {
            socket.emit("error", { message: "Login required" });
            return callback?.({ status: "error", message: "Unauthorized" });
          }

          const text = typeof message === "string" ? message.trim() : "";
          if (!text) return callback?.({ status: "error", message: "Empty message" });

          const insertResult = await pool.query(
            "INSERT INTO messages (user_id, message) VALUES ($1, $2) RETURNING id",
            [userInfo.id, text]
          );

          const messageId = insertResult.rows[0].id;

          const result = await pool.query(
            `SELECT m.id, m.message, m.created_at, m.user_id, u.username
             FROM messages m
             JOIN users u ON u.id = m.user_id
             WHERE m.id = $1`,
            [messageId]
          );

          const fullMessage = result.rows[0];
          io.emit("chat_message", fullMessage);
          callback?.({ status: "ok", message: fullMessage });
        } catch (err) {
          console.error(err);
          socket.emit("error", { message: "Message failed" });
          callback?.({ status: "error", message: "Database error" });
        }
      }
    );

    socket.on("delete_message", async (messageId: string) => {
      try {
        if (!userInfo || userInfo.role !== "admin") {
          return socket.emit("error", { message: "Admins only" });
        }

        await pool.query("DELETE FROM messages WHERE id=$1", [messageId]);
        io.emit("message_deleted", messageId);
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Delete failed" });
      }
    });

    socket.on("disconnect", async () => {
      messageTimestamps.delete(socket.id);

      if (!userInfo) return;

      try {
        const userRoom = `user_${userInfo.id}`;
        const activeSockets = await io.in(userRoom).fetchSockets();

        if (activeSockets.length > 0) {
          return;
        }

        await pool.query(
          "UPDATE users SET is_online = false, last_seen = NOW() WHERE id = $1",
          [userInfo.id]
        );

        io.emit("presence-update", {
          userId: userInfo.id,
          username: userInfo.username,
          isOnline: false,
        });
      } catch (err) {
        console.error(err);
      }
    });
  });

  return io;
};