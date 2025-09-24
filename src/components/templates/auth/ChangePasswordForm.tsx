"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { useChangePasswordMutation } from "@/hooks/auth/useChangePassword";
import { createSchemas } from "@/lib/schema/validations";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../atoms/ui/button";
import { Card, CardContent } from "../../atoms/ui/card";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { z } from "zod";
import { useTString } from "@/lib/tString";

const ChangePasswordForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schemas.ChangePasswordFormSchema),
  });

  const { mutate, isPending } = useChangePasswordMutation({
    onSuccess: async (response) => {
      toast.success(response.message);
      router.back();
    },
    onError: (error) => {
      const { message } = error.response.data as ErrorResponse;
      toast.error(message || "Something Went Wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schemas.ChangePasswordFormSchema>) => {
    mutate({
      current_password: data.currentPassword,
      password: data.newPassword,
      password_confirmation: data.repeatNewPassword,
    });
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    showTogglePassword
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    showTogglePassword
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    showTogglePassword
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" loading={isPending}>
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
