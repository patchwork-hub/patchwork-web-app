import { deleteProfileMedia } from "@/services/profile/deleteProfileMedia";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Account } from "@/types/account";

export const useDeleteProfileMediaMutation = (
  options: UseMutationOptions<
    Account,
    AxiosError,
    { mediaType: "avatar" | "header" }
  >
) => {
  return useMutation({
    mutationFn: deleteProfileMedia,
    ...options,
  });
};
