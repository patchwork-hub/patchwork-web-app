import { resetPassword } from "@/services/auth/resetPassword";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useResetPasswordMutation = (
  options: UseMutationOptions<
    {
      message: string;
    },
    AxiosError,
    {
      reset_password_token: string;
      password: string;
      password_confirmation: string;
    }
  >
) => {
  return useMutation({ mutationFn: resetPassword, ...options });
};
