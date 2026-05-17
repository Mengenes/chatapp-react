
import { useEffect } from "react";

import { Toaster } from "./components/ui/sonner";
import Routing from "./Pages/Routing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuthStore } from "./Store/authStore";
import SocketManager from "./SocketManager";


const queryClient = new QueryClient();

function App() {
  const restoreUser = useAuthStore((state) => state.restoreUser);
  const isRestored = useAuthStore((state) => state.isRestored);

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

if (!isRestored) return (
  <div className="w-full h-dvh flex items-center justify-center bg-secondary">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
       <SocketManager/>
        <Toaster richColors position="top-right" />
        <Routing />
      </Router>
    </QueryClientProvider>
  );
}

export default App;