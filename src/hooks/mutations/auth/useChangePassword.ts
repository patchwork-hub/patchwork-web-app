import { updatePassword } from "@/services/auth/updatePassword";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useChangePasswordMutation = (
  options: UseMutationOptions<
    {
      message: string;
    },
    AxiosError,
    {
      current_password: string;
      password: string;
      password_confirmation: string;
    }
  >
) => {
  return useMutation({ mutationFn: updatePassword, ...options });
};
