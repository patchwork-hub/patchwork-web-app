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
import { useOTPVerificationMutation } from "@/hooks/auth/useOTPVerification";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";

interface EmailVerificationProps extends React.ComponentPropsWithoutRef<"div"> {
  resetToken: string;
  email: string;
  setResetToken: React.Dispatch<React.SetStateAction<string>>;
}

const EmailVerification = ({
  resetToken,
  setResetToken,
  email,
}: EmailVerificationProps) => {
  const [value, setValue] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const { t } = useLocale();

  const router = useRouter();
  const { theme } = useTheme();
  const { mutate } = useOTPVerificationMutation({
    onSuccess: (res) => {
      router.push(
        `/auth/reset-password?resetToken=${resetToken}&token=${res.message.access_token}`
      );
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t("toast.invalid_code"));
    },
  });

  const { mutate: resendCode } = useForgotPasswordMutation({
    onSuccess: (res) => {
      setResetToken(res.reset_password_token);
      setTimer(60);
      setValue("");
      toast.success(t("toast.code_resent"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("toast.email_send_failed"));
    },
  });

  const handleResendCode = () => {
    resendCode({ email });
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (value.length === 4) {
      mutate({ id: resetToken, otp_secret: value });
    }
  }, [value, mutate, resetToken]);

  return (
    <Card>
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
              className={cn(
                "w-14 h-14",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "bg-gray-700 text-white"
                  : "bg-background text-black"
              )}
              index={0}
            />
            <InputOTPSlot
              className={cn(
                "w-14 h-14",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "bg-gray-700 text-white"
                  : "bg-background text-black"
              )}
              index={1}
            />
            <InputOTPSlot
              className={cn(
                "w-14 h-14",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "bg-gray-700 text-white"
                  : "bg-background text-black"
              )}
              index={2}
            />
            <InputOTPSlot
              className={cn(
                "w-14 h-14",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "bg-gray-700 text-white"
                  : "bg-background text-black"
              )}
              index={3}
            />
          </InputOTPGroup>
        </InputOTP>
        <CardFooter className="justify-center gap-x-1 mt-2">
          <p className="text-xs">{t("login.otp.no_code_prompt")}</p>
          {timer > 0 ? (
            <p className="text-xs">
              {t("login.otp.resend")} in {timer} sec
            </p>
          ) : (
            <Button
              className="text-xs p-1 h-auto text-red-400"
              variant="ghost"
              onClick={handleResendCode}
            >
              {t("login.otp.resend")}
            </Button>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
