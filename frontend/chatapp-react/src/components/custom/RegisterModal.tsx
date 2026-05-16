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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long")
    .max(20, "Confirm password must be at most 20 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterModal() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await axiosBaseurl.post("/auth/register", { email: data.email, username: data.username, password: data.password });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="bg-primary border-0 hover:bg-primary hover">Register</Button>} />

      <DialogContent className="w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Register to your account
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to create an account.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ FORM WRAPS EVERYTHING PROPERLY */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label className="font-bold">Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>
            <Field className="w-full max-w-sm">
              <Label className="font-bold">Username</Label>
              <Input type="username" {...register("username")} />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </Field>
            <Field>
              <Label className="font-bold">Password</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            <Field className="mb-6">
              <Label className="font-bold">Confirm Password</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" className="w-full max-w-sm">
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;