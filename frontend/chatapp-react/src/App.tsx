
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


  useEffect(() => {
    restoreUser();
  }, [restoreUser]);


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