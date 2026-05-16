
import { Outlet,Navigate } from "react-router-dom";
import { useAuthStore } from "../Store/authStore";

function ProtectedRoutes() {
    const userData=useAuthStore((state)=>state.user)
  return (
   userData ? <Outlet/> : <Navigate  replace to="/login"/>
  )
}

export default ProtectedRoutes