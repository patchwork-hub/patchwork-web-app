"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../../atoms/ui/card";
import { Button } from "../../atoms/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchemas } from "@/lib/schema/validations";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useState } from "react";
import EmailVerification from "./EmailVerification";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { z } from "zod";
import { useTString } from "@/lib/tString";
import { isSystemDark } from "@/utils/helper/helper";

const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>("");
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schemas.ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const getEmail = form.getValues("email");
  const { theme } = useTheme();
  const { mutate, isPending } = useForgotPasswordMutation({
    onSuccess: (res) => {
      toast.success(t("toast.email_sent"));
      setShowVerification(true);
      setResetToken(res.reset_password_token);
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("toast.send_failure"));
    },
  });

  const onSubmit = (
    values: z.infer<typeof schemas.ForgotPasswordFormSchema>
  ) => {
    mutate(values);
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {showVerification ? (
        <EmailVerification
          resetToken={resetToken}
          setResetToken={setResetToken}
          email={getEmail}
        />
      ) : (
        <Card className="bg-background text-foreground">
          <CardHeader className="text-center">
            {t("screen.forgot_password")}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            `${t("login.email_placeholder")}` as string
                          }
                          {...field}
                          className={cn(
                            theme === "dark" ||
                              (theme === "system" && isSystemDark)
                              ? "bg-gray-700"
                              : "bg-background"
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" loading={isPending}>
                  {t("common.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
