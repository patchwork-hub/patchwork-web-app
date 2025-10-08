import { createSchemas } from "@/lib/schema/validations";
import { signIn } from "@/services/auth/signin";
import { LoginResponse } from "@/types/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import z from "zod";

const _schemas = createSchemas();
type SignInFormData = z.infer<typeof _schemas.SignInFormSchema>;

export const useLoginEmailMutation = (
  options?: UseMutationOptions<LoginResponse, AxiosError, SignInFormData>
) => {
  return useMutation({ mutationFn: signIn, ...options });
};