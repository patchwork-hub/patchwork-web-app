import {
  deleteFavouriteChannelMutationFn,
  favouriteChannelMutationFn,
} from "@/services/community/toggleCommunityService";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useFavouriteChannelMutation = (
  options: UseMutationOptions<{ message: string }, AxiosError, { id: string }>
) => {
  return useMutation({ mutationFn: favouriteChannelMutationFn, ...options });
};

export const useDeleteFavouriteChannelMutation = (
  options: UseMutationOptions<{ message: string }, AxiosError, { id: string }>
) => {
  return useMutation({
    mutationFn: deleteFavouriteChannelMutationFn,
    ...options,
  });
};
