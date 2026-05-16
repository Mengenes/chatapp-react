import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axiosBaseurl from "../../configs/axios/AxiosBaseurl";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../Store/authStore";


const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6,"Password has to be longer than 6 characters").max(20,"Password has to be shorter than 20 characters "),
});

type LoginFormData = zod.infer<typeof loginSchema>;

function LoginModal() {
   const setUserData = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
     const res = await axiosBaseurl.post("/auth/login", data);
 setUserData(res.data.user)
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className='bg-primary border-0 hover:bg-primary hover '>Login</Button>} />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Login to your Account
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to login to your account.
          </DialogDescription>
        </DialogHeader>

      
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label className="mb-2 font-bold">Email</Label>
              <Input type="email" {...register("email")} className="w-full max-w-sm" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <Field className="mb-3">
              <div className="flex items-center justify-between">
                <Label className="mb-2 font-bold">Password</Label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary underline ml-auto font-bold"
                >
                  Forgot Password
                </Link>
              </div>
             
              <Input type="password" {...register("password")}  className="w-full max-w-sm"/>
              {errors.password && (
                <p className="text-red-500 text-sm ">
                  {errors.password.message}
                </p>
                
              )}
             
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" className="w-full max-w-sm">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;