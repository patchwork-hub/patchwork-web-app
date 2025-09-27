"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../../atoms/ui/card";
import { Button } from "../../atoms/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSchemas
} from "@/lib/schema/validations";
import { useForm } from "react-hook-form";
import { setToken } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/hooks/auth/useResetPassword";
import { useLocale } from "@/providers/localeProvider";
import { z } from "zod";
import { useTString } from "@/lib/tString";

interface ResetPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  token: string;
  resetToken: string;
}

const ResetPasswordForm = ({
  className,
  token,
  resetToken,
  ...props
}: ResetPasswordFormProps) => {
  const router = useRouter();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schemas.ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      password_confirmation: ""
    }
  });

  const { mutate, isPending } = useResetPasswordMutation({
    onSuccess: (res) => {
      setToken(token, { isSignup: false });
      toast.success(res.message);
      router.replace("/");
    },
    onError: (error) => {
      console.log("error => ", error);
      toast.error(t("toast.password_reset_failed"));
    }
  });

  const onSubmit = (data: z.infer<typeof schemas.ResetPasswordFormSchema>) => {
    mutate({
      reset_password_token: resetToken,
      password: data.password,
      password_confirmation: data.password_confirmation
    });
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card>
        <CardHeader className="text-center">{t("screen.reset_password")}</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        showTogglePassword
                        placeholder={`${t("login.password_placeholder")}` as string}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.confirm_password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        showTogglePassword
                        placeholder={`${t("login.confirm_placeholder")}` as string}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" loading={isPending}>
                {t("common.update")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
