import jwt from "jsonwebtoken";
import cookie from "cookie";
import type { ExtendedError, Socket } from "socket.io";

export interface JwtUser {
  id: string;
  role: "user" | "admin";
}

export const socketAuth = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      socket.data.user = null;
      return next();
    }

    const cookies = cookie.parse(cookieHeader);

    const token = cookies.accessToken;

    if (!token) {
      socket.data.user = null;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtUser;

    socket.data.user = decoded;

    next();

  } catch (err) {
    console.error("Socket auth error:", err);
    socket.data.user = null;
    return next();
  }
};