import { io, Socket } from "socket.io-client";

export const socket: Socket = io(import.meta.env.VITE_SOCKETIO_BASEURL, {
  withCredentials: true,
  autoConnect: false,
});

