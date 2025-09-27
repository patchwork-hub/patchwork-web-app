import { changeEmail } from "@/services/auth/changeEmail";
import {
  changeNewsmastEmailVerification,
  forgetEmailVerifyOTP,
  forgetPasswordVerifyOTP
} from "@/services/auth/forgotPassword";
import { signupVerifyOTP } from "@/services/auth/signup";
import { LoginResponse } from "@/types/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type ErrorResponseData = {
  message?: string;
}

export const useOTPVerificationMutation = (
  options: UseMutationOptions<
    {
      message: {
        access_token: string;
        token_type: string;
        scope: string;
        created_at: string;
      };
    },
    AxiosError<ErrorResponseData>,
    {
      id: string;
      otp_secret: string;
    }
  >
) => {
  return useMutation({ mutationFn: forgetPasswordVerifyOTP, ...options });
};

export const useSignupOTPVerificationMutation = (
  options: UseMutationOptions<
    {
      message: {
        access_token: string;
        token_type: string;
        scope: string;
        created_at: string;
      };
    },
    AxiosError,
    {
      id: string;
      otp_secret: string;
    }
  >
) => {
  return useMutation({ mutationFn: signupVerifyOTP, ...options });
};

export const useChangeEmailVerificationMutation = (
  options: UseMutationOptions<
    { message: LoginResponse },
    AxiosError,
    {
      id: string;
      otp_secret: string;
    }
  >
) => {
  return useMutation({ mutationFn: forgetEmailVerifyOTP, ...options });
};

export const useChangeNewsmastEmailVerificationMutation = (
  options: UseMutationOptions<
    { message: LoginResponse },
    AxiosError,
    {
      user_id: string;
      confirmed_otp_code: string;
    }
  >
) => {
  return useMutation({
    mutationFn: changeNewsmastEmailVerification,
    ...options
  });
};

export const useChangeEmailMutation = (
  options: UseMutationOptions<
    { message: LoginResponse },
    AxiosError,
    {
      current_password: string;
      email: string;
    }
  >
) => {
  return useMutation({ mutationFn: changeEmail, ...options });
};
