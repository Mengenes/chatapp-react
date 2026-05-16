import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import axiosBaseurl from '../configs/axios/AxiosBaseurl';
import { toast } from 'sonner';
const forgotPasswordSchema = zod.object({
  email: zod.string().email()
});
type ForgotPasswordFormData = zod.infer<typeof forgotPasswordSchema>;
function ForgotPassword() {

  const {register,handleSubmit}=useForm<ForgotPasswordFormData>({resolver:zodResolver(forgotPasswordSchema)})
  async function onSubmit(data:ForgotPasswordFormData){
    try {
       await  axiosBaseurl.post('/auth/forgot-password',data);
       toast.success("Password reset link sent to your email if it exists.");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please try again.");
    }
   
  }
  return (
    <main className="flex  w-full min-h-screen  items-center justify-center">
     <Card className='w-full  md:w-auto   px-4 py-10'>



     
   <CardHeader>
    <CardTitle className='font-extrabold'>Forgot Password</CardTitle>
    <CardDescription>
      Enter your email to receive a password reset link.
    </CardDescription>
    </CardHeader>
<CardContent>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-4">
      <Label htmlFor="email" className='mb-2 font-bold'>Email</Label>
      <Input id="email" type="email" {...register("email")}  className='w-full'/>
    </div>
    <Button type="submit" className='w-full'>Send Reset Link</Button>
  </form>
</CardContent>
      </Card>
      </main>
  )
}

export default ForgotPassword