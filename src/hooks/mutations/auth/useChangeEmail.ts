import { changeEmail, changeNewsmastEmail } from "@/services/auth/changeEmail";
import { LoginResponse } from "@/types/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type ChangeEmailErrorData = {
  message?: string;
}

export const useChangeEmailMutation = (
  options: UseMutationOptions<
    { message: LoginResponse },
    AxiosError<ChangeEmailErrorData>,
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
    AxiosError<ChangeEmailErrorData>,
    {
      email: string;
      domain_name: string;
    }
  >
) => {
  return useMutation({ mutationFn: changeNewsmastEmail, ...options });
};
