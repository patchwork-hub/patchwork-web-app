"use client";
import { Button } from "../../atoms/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/atoms/ui/input-otp";
import { useEffect, useState } from "react";
import {
  useChangeEmailMutation,
  useChangeEmailVerificationMutation,
  useChangeNewsmastEmailVerificationMutation,
  useOTPVerificationMutation
} from "@/hooks/auth/useOTPVerification";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useRouter } from "next/navigation";
import { useChangeNewsmastEmailMutation } from "@/hooks/auth/useChangeEmail";
import { useAuthStore } from "@/store/auth/authStore";
import { useActiveDomainStore } from "@/store/auth/activeDomain";
import { getNewEmail, removeToken } from "@/lib/auth";
import { DEFAULT_API_URL } from "@/utils/constant";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useLocale } from "@/components/molecules/providers/localeProvider";

const ChangeEmailVerificationForm = () => {
  const router = useRouter();
  const {t} = useLocale();

  const { userOriginInstance } = useAuthStore();
  const { domain_name } = useActiveDomainStore();

  const getData = getNewEmail();
  const currentPassword =
    typeof getData === "object" ? getData.currentPassword : undefined;
  const newAccessToken =
    typeof getData === "object" ? getData.newAccessToken : undefined;

  const [value, setValue] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [currentSecretToken, setCurrentSecretToken] = useState(newAccessToken);

  const { mutate } = useChangeEmailVerificationMutation({
    onSuccess: async (response) => {
      toast.success(
        t("toast.email_updated")
      );
      localStorage.removeItem("fcmToken");
      removeToken();
      queryClient.clear();
      router.refresh();
    },
    onError: () => {
      toast.error("Incorrect OTP");
    }
  });

  const { mutate: changeNewsmastEmailVerification } =
    useChangeNewsmastEmailVerificationMutation({
      onSuccess: () => {
        toast.success(
         t("toast.email_updated")
        );
      },
      onError: () => {
        toast.error(t("toast.incorrect_otp"));
      }
    });

  const { mutateAsync: resendCode } = useChangeEmailMutation({
    onSuccess: async (response) => {
      setCurrentSecretToken(response.message.access_token);
      toast.success(t("toast.otp_resent"));
    },
    onError: () => {
      toast.error(t("toast.generic_error"));
    }
  });

  const { mutateAsync: changeNewsmastEmail } = useChangeNewsmastEmailMutation({
    onSuccess: async (response, variables) => {
      toast.success(t("toast.verification_sent"));
    },
    onError: (error) => {
      toast.error(error?.message || t("toast.generic_error"));
    }
  });

  const handleResendCode = () => {
    if (userOriginInstance === "https://newsmast.social") {
      changeNewsmastEmail({
        email: typeof getData === "object" ? getData.newEmail : "",
        domain_name: domain_name
      });
    } else {
      resendCode({
        email: typeof getData === "object" ? getData.newEmail : "",
        current_password: currentPassword!
      });
    }
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
    if (
      userOriginInstance === "https://newsmast.social" &&
      value.length === 4
    ) {
      changeNewsmastEmailVerification({
        user_id: "",
        confirmed_otp_code: value
      });
    } else if (userOriginInstance !== "https://newsmast.social") {
      if (value.length === 4 && currentSecretToken) {
        mutate({ id: currentSecretToken, otp_secret: value });
      }
    }
  }, [value, mutate]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p>Verify your email</p>
        <p className="text-center">
          We've sent a 4-digit verification code to your email.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="mx-auto">
            <InputOTPSlot className="w-14 h-14 dark:bg-gray-700 bg-background" index={0} />
            <InputOTPSlot className="w-14 h-14 dark:bg-gray-700 bg-background" index={1} />
            <InputOTPSlot className="w-14 h-14 dark:bg-gray-700 bg-background" index={2} />
            <InputOTPSlot className="w-14 h-14 dark:bg-gray-700 bg-background" index={3} />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex justify-center items-center gap-x-1 mt-2">
          <p className="text-xs">
            {"Didn't receive the code? Check your spam folder or"}
          </p>
          {timer > 0 ? (
            <p className="text-xs">Re-send in {timer} sec</p>
          ) : (
            <Button
              className="text-xs p-1 h-auto text-red-400"
              variant="ghost"
              onClick={handleResendCode}
            >
              Re-send
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailVerificationForm;
