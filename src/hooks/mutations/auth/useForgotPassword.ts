import { forgotPassword } from "@/services/auth/forgotPassword";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useForgotPasswordMutation = (
  options: UseMutationOptions<
    { reset_password_token: string },
    AxiosError,
    { email?: string }
  >
) => {
  return useMutation({ mutationFn: forgotPassword, ...options });
};
