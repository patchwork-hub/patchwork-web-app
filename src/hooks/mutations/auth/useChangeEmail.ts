import { changeEmail, changeNewsmastEmail } from "@/services/auth/changeEmail";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

export const useChangeNewsmastEmailMutation = (
  options: UseMutationOptions<
    { message: LoginResponse },
    AxiosError,
    {
      email: string;
      domain_name: string;
    }
  >
) => {
  return useMutation({ mutationFn: changeNewsmastEmail, ...options });
};
