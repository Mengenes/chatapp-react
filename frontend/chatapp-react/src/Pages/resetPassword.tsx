import axiosBaseurl from "../configs/axios/AxiosBaseurl"
import zod from "zod"
import { Card,CardHeader,CardTitle,CardContent,CardDescription, } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../components/ui/input"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useParams } from "react-router-dom"

function ResetPassword() {
  const {token} = useParams<{ token: string }>();
const resetPasswordSchema = zod.object({
  password:zod.string().min(6).max(20),
  confirmPassword:zod.string().min(6,'Passwords must be at least 6 characters long').max(20,'Passwords must be at most 20 characters long'),
}).refine((data)=>data.password===data.confirmPassword,{
  message:"Passwords do not match",  path: ["confirmPassword"]});
type ResetPasswordFormData = zod.infer<typeof resetPasswordSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });
  async function onSubmit(data: ResetPasswordFormData) {
try {
  await axiosBaseurl.post(`/auth/reset-password/${token}`,{ password: data.password });
  toast.success("Password reset successfully!");
} catch (err) {
  console.error("Failed to reset password:", err);
  toast.error("Failed to reset password. Please try again.");
}

  }


  return (
  <main className="flex  w-full min-h-screen  items-center justify-center">
     <Card>



     
   <CardHeader>
    <CardTitle>Reset Password</CardTitle>
    <CardDescription>
      Enter your new password to reset your account password.
    </CardDescription>
    </CardHeader>
<CardContent>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-4">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" {...register("password")} />
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
    </div>
     <div className="mb-4">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
    </div>
    <Button type="submit">Change Password</Button>
  </form>
</CardContent>
      </Card>
      </main>
  )
}

export default ResetPassword