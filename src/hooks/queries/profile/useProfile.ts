import { updateProfile } from "@/services/profile/updateProfile";
import { Account } from "@/types/account";
import { UpdateProfilePayload } from "@/types/profile";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useProfileMutation = (
  options: UseMutationOptions<Account, AxiosError, UpdateProfilePayload>
) => {
  return useMutation({ mutationFn: updateProfile, ...options });
};
