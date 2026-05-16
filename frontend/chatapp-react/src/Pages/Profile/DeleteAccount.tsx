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

const deleteAccountSchema = z.object({
  currentPassword: z.string().min(6).max(20),
});

type deleteType = z.infer<typeof deleteAccountSchema>;

function DeleteAccount() {
  const { register, handleSubmit } = useForm<deleteType>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: deleteType) => {
    try {
      await axiosBaseurl.delete("/user/delete-account", { data });
      toast.success("Account deleted successfully");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="destructive" className="text-xs sm:text-sm">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Enter your password to permanently delete your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <Field>
              <Label>Current Password</Label>
              <Input type="password" {...register("currentPassword")} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Confirm Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAccount;