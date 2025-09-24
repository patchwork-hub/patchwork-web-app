"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../atoms/ui/card";
import { Button } from "../../atoms/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/atoms/ui/input-otp";
import { useEffect, useState } from "react";
import {
  useOTPVerificationMutation,
  useSignupOTPVerificationMutation,
} from "@/hooks/auth/useOTPVerification";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getToken, setToken } from "@/lib/auth";
import { ErrorResponse } from "@/types/error";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";

const SignupEmailVerification = () => {
  const [value, setValue] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const { theme } = useTheme();
  const token = getToken();

  const router = useRouter();
  const {t} = useLocale();

  const { mutate: verifyOTP } = useSignupOTPVerificationMutation({
    onSuccess: (res) => {
      setToken(res.message.access_token, {
        isSignup: false,
      });
      Cookies.remove("isSignup");
      router.refresh();
      router.push("/home");

      // router.push("/auth/sign-up/join-communities");
    },
    onError: (err) => {
      const { message } = err.response.data as ErrorResponse;
      toast.error(message);
    },
  });

  const { mutate: resendCode } = useSignupOTPVerificationMutation({
    onSuccess: (res) => {
      // setResetToken(res.message.access_token);
      setTimer(60);
      setValue("");
      toast.success(t("toast.resend_success"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("toast.send_failure"));
    },
  });

  // const handleResendCode = () => {
  //   resendCode({ email });
  // };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (value.length === 4 && token) {
      verifyOTP({ id: token, otp_secret: value });
    }
  }, [value]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className=" card-primary">
          <CardHeader className="text-center">
            {t("login.send_otp")}
            <CardDescription className="text-center">
              {t("login.otp.instruction")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup className="mx-auto">
                <InputOTPSlot
                  index={0}
                  className={cn(
                    "w-14 h-14",
                    theme === "dark" || (theme === "system" && isSystemDark)
                      ? "bg-gray-700"
                      : "bg-background"
                  )}
                />
                <InputOTPSlot
                  index={1}
                  className={cn(
                    "w-14 h-14",
                    theme === "dark" || (theme === "system" && isSystemDark)
                      ? "bg-gray-700"
                      : "bg-background"
                  )}
                />
                <InputOTPSlot
                  index={2}
                  className={cn(
                    "w-14 h-14",
                    theme === "dark" || (theme === "system" && isSystemDark)
                      ? "bg-gray-700"
                      : "bg-background"
                  )}
                />
                <InputOTPSlot
                  index={3}
                  className={cn(
                    "w-14 h-14",
                    theme === "dark" || (theme === "system" && isSystemDark)
                      ? "bg-gray-700"
                      : "bg-background"
                  )}
                />
              </InputOTPGroup>
            </InputOTP>
            <CardFooter className="justify-center gap-x-1 mt-2">
              <p className="text-xs">{t("login.otp.no_code_prompt")}</p>
              {timer > 0 ? (
                <p className="text-xs">{t("login.otp.resend")} in {timer} sec</p>
              ) : (
                <Button
                  className="text-xs p-1 h-auto text-red-400"
                  variant="ghost"
                  // onClick={handleResendCode}
                >
                  {t("login.otp.resend")}
                </Button>
              )}
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupEmailVerification;
