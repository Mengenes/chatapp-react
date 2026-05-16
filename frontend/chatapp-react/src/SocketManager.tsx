import { useEffect } from "react";
import { useAuthStore } from "./Store/authStore";
import { socket } from "./socket";

function SocketManager() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [user]);

  return null;
}

export default SocketManager;