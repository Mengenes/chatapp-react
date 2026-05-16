import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axiosBaseurl from "../../configs/axios/AxiosBaseurl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field, FieldGroup } from "../../components/ui/field";
import { Label } from "../../components/ui/label";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(20),
  newPassword: z.string().min(6).max(20),
});

type changePasswordType = z.infer<typeof changePasswordSchema>;

function ChangePassword() {
  const { register, handleSubmit } = useForm<changePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: changePasswordType) => {
    try {
      await axiosBaseurl.patch("/user/update-password", data);
      toast.success("Password updated successfully");
    } catch {
      toast.error("Failed to update password");
    }
  };

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" className="text-xs sm:text-sm">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your current and new password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <Field>
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} />
            </Field>

            <Field>
              <Label>New Password</Label>
              <Input type="password" {...register("newPassword")} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePassword;