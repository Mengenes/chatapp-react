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

const changeEmailSchema = z.object({
  currentPassword: z
    .string()
    .min(6)
    .max(20),
  email: z.string().email(),
});

type changeEmailType = z.infer<typeof changeEmailSchema>;

function ChangeEmail() {
  const { register, handleSubmit } = useForm<changeEmailType>({
    resolver: zodResolver(changeEmailSchema),
  });

  const onSubmit = async (data: changeEmailType) => {
    try {
      await axiosBaseurl.patch("/user/update-email", data);
      toast.success("Email updated successfully");
    } catch {
      toast.error("Failed to update email");
    }
  };

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" className="text-xs sm:text-sm">
          Change Email
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Enter your new email and current password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <Field>
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} />
            </Field>

            <Field>
              <Label>New Email</Label>
              <Input type="email" {...register("email")} />
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

export default ChangeEmail;