"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../atoms/ui/card";
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
import { useState } from "react";
import { removeToken, setToken } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/error";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { Label } from "@/components/atoms/ui/label";
import {
  useGetTokenMutation,
  useSignupMutation,
} from "@/hooks/mutations/auth/useSignup";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/localeProvider";
import z from "zod";
import { useTString } from "@/lib/tString";
import { isSystemDark } from "@/utils/helper/helper";

interface SignInFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

const SignupForm = ({ className, ...props }: SignInFormProps) => {
  const [terms, setTerms] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const router = useRouter();

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schemas.SignUpFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
  });

  const { mutateAsync: getAppToken } = useGetTokenMutation();

  const { mutateAsync: signupMutate, isPending } = useSignupMutation({
    onError: (err) => {
      if (err.response?.data) {
      const { error } = err.response.data as ErrorResponse;
      toast.error(error || "Invalid email or password!");
    } else {
      toast.error("Invalid email or password!");
    }
    },
  });

  const onSubmit = (values: z.infer<typeof schemas.SignUpFormSchema>) => {
    const data = {
      ...values,
      agreement: terms,
      locale: "en",
    };
    if (terms) {
      getAppToken().then((res) => {
        const accessToken = res.access_token;
        setToken(accessToken, {
          isSignup: true,
        });

        signupMutate(
          { ...data, access_token: accessToken },
          {
            onSuccess: (resData) => {
              setToken(resData.access_token, {
                isSignup: false,
              });
              router.push(`/auth/sign-up/email-verify`);
            },
            onError: (err) => {
              if (err.response?.data) {
                const { error } = err.response.data as ErrorResponse;
                toast.error(error?.split(":")[1] || error || "Invalid email or password!");
              } else {
                toast.error("Invalid email or password!");
              }
              form.reset();
              removeToken();
            },
          }
        );
      });
    } else {
      toast.error(t("toast.agreement_prompt"));
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="bg-background text-foreground rounded-lg">
        <CardHeader className="text-center">{t("screen.sign_up")}</CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={
                          `${t("login.email_placeholder")}` as string
                        }
                        className={cn(
                          theme === "dark" ||
                            (theme === "system" && isSystemDark)
                            ? "bg-gray-700"
                            : "bg-background"
                        )}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.username")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={cn(
                          theme === "dark" ||
                            (theme === "system" && isSystemDark)
                            ? "bg-gray-700"
                            : "bg-background"
                        )}
                        placeholder={
                          `${t("login.username_placeholder")}` as string
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          `${t("login.password_placeholder")}` as string
                        }
                        className={cn(
                          theme === "dark" ||
                            (theme === "system" && isSystemDark)
                            ? "bg-gray-700"
                            : "bg-background"
                        )}
                        showTogglePassword={true}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.repeat_password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          `${t("login.repeat_password_placeholder")}` as string
                        }
                         className="bg-background dark:bg-gray-700"
                        showTogglePassword={true}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={terms}
                  onCheckedChange={(checked) => {
                    setTerms(checked === "indeterminate" ? false : checked);
                  }}
                />
                <Label htmlFor="terms" className="cursor-pointer">
                  {t("login.agreement", {
                    components: {
                      orangeText: (chunks) => (
                        <span key="terms-wrapper" className="text-orange-500">
                          <Link
                            className="underline"
                            target="_blank"
                            href="http://newsmastfoundation.org/terms-conditions/"
                            rel="noopener noreferrer"
                          >
                            {chunks}
                          </Link>
                        </span>
                      ),
                    },
                  })}
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-900 mt-2 text-foreground"
                loading={isPending}
              >
                {t("screen.sign_up")}
              </Button>
              <div className="flex justify-center items-center gap-1">
                <Label htmlFor="terms" className="cursor-pointer">
                  {t("login.have_account")}
                </Label>
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4 text-sm"
                >
                  {t("login.sign_in")}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
