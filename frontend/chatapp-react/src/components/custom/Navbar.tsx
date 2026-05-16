import { Link } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import { Button } from "../ui/button";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Profile from "../../Pages/Profile/Profile";

function Navbar() {
  const userData = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="w-full  text-secondary flex flex-wrap items-center justify-between p-3 shadow-2xl backdrop-blur-2xl bg-primary  ">
      <div className="flex  flex-wrap items-center gap-4">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
      </div>

      <div className="  flex flex-wrap  flex-1 items-center justify-end gap-4 ">
        {userData ? (
          <>
            <p className="whitespace-nowrap">{userData.username}</p>
            <Profile />
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <LoginModal />
            <RegisterModal />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;