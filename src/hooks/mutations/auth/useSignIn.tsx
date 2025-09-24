import { createSchemas } from "@/lib/schema/validations";
import { signIn } from "@/services/auth/signin";
import { LoginResponse } from "@/types/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import z from "zod";

const schemas = createSchemas();
export const useLoginEmailMutation = (
  options?: UseMutationOptions<LoginResponse, AxiosError, z.infer<typeof schemas.SignInFormSchema>>
) => {
  return useMutation({ mutationFn: signIn, ...options });
};
