import { Link } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import { Button } from "../ui/button";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Profile from "../../Pages/Profile/Profile";
import logo from "../../assets/bubble-speech_1768686.png"
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
  <div>
<img src={logo} alt="Chatapp Logo" className="w-4 h-4 md:w-8 md:h-8 lg:w-10 lg:h-10"></img>

  </div>
      <div className="  flex flex-wrap   items-center justify-end gap-4 ">
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