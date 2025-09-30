"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useEffect, useState } from "react";
import SignInWithMastodon from "./SignInMastodonForm";
import { removeToken, setToken } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/localeProvider";
import { z } from "zod";
import { isSystemDark } from "@/utils/helper/helper";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/atoms/ui/modal";
import { useAuthStore, useAuthStoreAction } from "@/stores/auth/authStore";
import { useTString } from "@/lib/tString";
import { useLoginEmailMutation } from "@/hooks/mutations/auth/useSignIn";
import { AxiosError } from "axios";

type SignInFormProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  code?: string;
}

const SignInForm = ({ className, code, ...props }: SignInFormProps) => {
  const { setSignInWithMastodon } = useAuthStoreAction();
  const [isOpen, setIsOpen] = useState(false);
  const isSignInWithMastodon = useAuthStore(
    (state) => state.isSignInWithMastodon
  );
  const router = useRouter();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const { setAuthToken } = useAuthStoreAction();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schemas.SignInFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { refetch: verifyAuthToken, isFetching: isVerifyAuthTokenFetching } =
    useVerifyAuthToken({
      enabled: false,
    });

  const handleLogout = async () => {
    setAuthToken("");
    localStorage.removeItem("fcmToken");
    removeToken();
    queryClient.clear();
    router.refresh();
  };

  const { mutateAsync, isPending } = useLoginEmailMutation({
    onSuccess: async (res) => {
      setToken(res.access_token, { isSignup: false });
      try {
        const result = await verifyAuthToken();
        if (result.data) {
          router.refresh();
          router.replace("/");
        } else if (result.error) {
          toast.error(
            (result.error as { message: string })?.message ||
              "Verification failed. Please confirm your email."
          );
          handleLogout();
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || "Verification failed");
        } else {
          toast.error("An unknown error occurred during verification.");
        }
      }
    },
    onError: () => {
      setIsOpen(true);
    },
  });

  const onSubmit = (values: z.infer<typeof schemas.SignInFormSchema>) => {
    mutateAsync(values);
  };

  useEffect(() => {
    if (code) {
      setSignInWithMastodon?.(true);
    }
  }, [code]);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {isSignInWithMastodon ? (
        <SignInWithMastodon
          setSignInWithMastodon={setSignInWithMastodon}
          code={code}
        />
      ) : (
        <Card className="bg-background text-foreground rounded-lg">
          <CardHeader className="text-center">
            {t("login.title")}
            <CardDescription className="text-center">
              {t("login.description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            `${t("login.email_placeholder")}` as string
                          }
                          {...field}
                          className="bg-background dark:bg-gray-700"
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
                          showTogglePassword={true}
                          className="bg-background dark:bg-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        {t("login.forgot_password")}
                      </Link>
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-orange-900 text-foreground"
                    loading={isPending || isVerifyAuthTokenFetching}
                  >
                    {t("login.sign_in")}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    className={cn(
                      "w-full bg-background text-foreground border hover:bg-background"
                    )}
                    onClick={() => setSignInWithMastodon?.(true)}
                  >
                    {t("login.mastodon_login")}
                  </Button>
                  <div className="flex justify-center items-center gap-2 text-sm">
                    <p>{t("login.no_account_prompt")}</p>{" "}
                    <Button variant="link" className="w-fit px-0 text-base">
                      <Link
                        href="/auth/sign-up"
                        className={cn(
                          "text-sm",
                          theme === "dark" ||
                            (theme === "system" && isSystemDark)
                            ? "text-white"
                            : "text-black"
                        )}
                      >
                        {t("login.create_account")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("auth.error")}
        className="border p-4"
      >
        <p className="py-4 text-center">{t("auth.invalid")}</p>
        <div className="w-full flex items-center justify-center space-x-6">
          <Button
            type="button"
            className="w-fit bg-orange-900"
            onClick={() => setIsOpen(false)}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SignInForm;
