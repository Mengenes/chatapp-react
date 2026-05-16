import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosBaseurl from "../../configs/axios/AxiosBaseurl";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuthStore } from "../../Store/authStore";
import { Card } from "../ui/card";
import Navbar from "./Navbar";
import { ScrollArea } from "../ui/scroll-area";
import ChatSkeleton from "./ChatSkeleton";
import { socket } from "../../socket";

type PresenceUpdate = {
  userId: string;
  username: string;
  isOnline: boolean;
};

type RawUserData = {
  id: string;
  username: string;
  email?: string;
  role?: "user" | "admin";
  is_online: boolean;
};

export type MessageData = {
  id: string;
  message: string;
  created_at: string;
  username: string;
};

export type UserData = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isOnline: boolean;
};

function FetchMessages() {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const storeUsers = useAuthStore((state) => state.users);
  const setUsers = useAuthStore((state) => state.setUsers);
  const updateUserStatus = useAuthStore((state) => state.updateUserStatus);

  const [message, setMessage] = useState("");

  const { data: messages = [], isLoading } = useQuery<MessageData[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axiosBaseurl.get("/auth/messages");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5000,
  });

  const { data: usersData = [] } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosBaseurl.get("/auth/users");
      if (!Array.isArray(res.data)) return [];
      return res.data.map((u: RawUserData) => ({
        id: u.id,
        username: u.username,
        email: u.email ?? "",
        role: u.role ?? "user",
        isOnline: u.is_online === true,
      }));
    },
    staleTime: 5000,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (usersData.length > 0) setUsers(usersData);
  }, [usersData, setUsers]);

  useEffect(() => {
    const handleMessage = (newMessage: MessageData) => {
      queryClient.setQueryData(["messages"], (old: MessageData[] = []) => [
        ...old,
        newMessage,
      ]);
    };

    const handleDelete = (id: string) => {
      queryClient.setQueryData(["messages"], (old: MessageData[] = []) =>
        old.filter((m) => String(m.id) !== String(id))
      );
    };

    const handlePresence = (data: PresenceUpdate) => {
      updateUserStatus(data.userId, data.username, data.isOnline);
    };

    socket.on("chat_message", handleMessage);
    socket.on("message_deleted", handleDelete);
    socket.on("presence-update", handlePresence);

    return () => {
      socket.off("chat_message", handleMessage);
      socket.off("message_deleted", handleDelete);
      socket.off("presence-update", handlePresence);
    };
  }, [queryClient, updateUserStatus]);

  const trimmed = useMemo(() => message.trim(), [message]);

  const sendMessage = useCallback(() => {
    if (!user || !trimmed) return;
    socket.emit("chat_message", { message: trimmed });
    setMessage("");
  }, [user, trimmed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") sendMessage();
    },
    [sendMessage]
  );

  if (isLoading) return <ChatSkeleton />;

  return (
    <Card className="w-full    h-dvh   shadow-2xl flex-col rounded-xs bg-secondary overflow-hidden   sm:text-sm md:text-base   ">
      <Navbar />

      <div className="flex flex-row flex-1 p-3 bg-secondary gap-2 overflow-hidden">
        <ScrollArea className="w-full max-w-50 min-h-[32dvh] border rounded-2xl">
          <div>
            <h3 className="font-bold mb-2 text-center border-b p-3 bg-primary text-secondary">
              Users
            </h3>
            {storeUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border p-3 hover:bg-gray-200"
              >
                <span className="text-sm font-bold">
                  {u.username}{" "}
                  <span style={{ color: u.isOnline ? "green" : "gray" }}>
                    ● {u.isOnline ? "Online" : "Offline"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="w-full max-w-screen flex flex-col gap-1">
          <div className="overflow-y-auto border p-2 rounded-2xl h-full">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 w-full  max-w-dvw p-2">
                <span className="font-bold text-primary wrap-break-word">{msg.username}:</span>
                <span className="wrap-break-word">{msg.message}</span>
                {user?.role === "admin" && (
                  <button
                    onClick={() => socket.emit("delete_message", msg.id)}
                    className="ml-auto text-xs text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type..."
            />
            <Button disabled={!trimmed} onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FetchMessages;