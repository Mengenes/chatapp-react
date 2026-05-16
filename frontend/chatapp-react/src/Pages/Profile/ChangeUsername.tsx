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

const changeUsernameSchema = z.object({
  currentPassword: z.string().min(6).max(20),
  newUsername: z.string().min(3).max(20),
});

type changeUsernameType = z.infer<typeof changeUsernameSchema>;

function ChangeUsername() {
  const { register, handleSubmit } = useForm<changeUsernameType>({
    resolver: zodResolver(changeUsernameSchema),
  });

  const onSubmit = async (data: changeUsernameType) => {
    try {
      await axiosBaseurl.patch("/user/update-username", data);
      toast.success("Username updated successfully");
    } catch {
      toast.error("Failed to update username");
    }
  };

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" className="text-xs sm:text-sm">
          Change Username
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Username</DialogTitle>
          <DialogDescription>
            Enter your new username and current password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <Field>
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} />
            </Field>

            <Field>
              <Label>New Username</Label>
              <Input type="text" {...register("newUsername")} />
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

export default ChangeUsername;