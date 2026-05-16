import { useQuery } from "@tanstack/react-query";
import axiosBaseurl from "../../configs/axios/AxiosBaseurl";

import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import DeleteAccount from "./DeleteAccount";

import { Button } from "../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

function Profile() {
  async function getProfile() {
    try {
      const res = await axiosBaseurl.get("/user/me");
      return res.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className='bg-primary border-0 hover:bg-primary hover'>Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Profile
          </DialogTitle>

          <DialogDescription>
            Manage and see your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center gap-2">
            <p className="p-1 font-medium">Username:</p>

            {!isLoading ? (
              userData?.username
            ) : (
              <div className="h-4 bg-skeleton rounded-full w-20 animate-pulse"></div>
            )}

            <ChangeUsername />
          </div>

          <div className="flex items-center gap-2">
            <p className="p-1 font-medium">Email:</p>

            {!isLoading ? (
              userData?.email
            ) : (
              <div className="h-4 bg-skeleton rounded-full w-30 animate-pulse"></div>
            )}

            <ChangeEmail />
          </div>

          <div className="flex items-center gap-2">
            <p className="p-1 font-medium">Role:</p>

            {!isLoading ? (
              userData?.role
            ) : (
              <div className="h-4 bg-skeleton rounded-full w-13 animate-pulse"></div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="p-1 font-medium">Password:</p>

            {!isLoading ? (
              <p>********</p>
            ) : (
              <div className="h-4 bg-skeleton rounded-full w-20 animate-pulse"></div>
            )}

            <ChangePassword />
          </div>

          <div className="flex self-end pt-2">
            <DeleteAccount />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;