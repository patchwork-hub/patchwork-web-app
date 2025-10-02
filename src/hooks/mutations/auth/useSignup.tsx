import { createSchemas } from "@/lib/schema/validations";
import { getAppToken, signUp } from "@/services/auth/signup";
import { LoginResponse } from "@/types/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import z from "zod";

const schemas = createSchemas();
export const useGetTokenMutation = () => {
  return useMutation({ mutationFn: getAppToken });
};
export const useSignupMutation = (
  options: UseMutationOptions<
    LoginResponse,
    AxiosError,
    z.infer<typeof schemas.SignUpFormSchema> & {
      agreement: boolean;
      locale: string;
      access_token: string;
    }
  >
) => {
  return useMutation({ mutationFn: signUp, ...options });
};
