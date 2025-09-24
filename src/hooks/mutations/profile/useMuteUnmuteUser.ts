import { queryClient } from "@/components/molecules/providers/queryProvider";
import {
  blockUnBlockUserMutationFn,
  muteUnMuteUserMutationFn
} from "@/services/profile/muteAndBlock";
import { MuteBlockUserAccount, RelationShip } from "@/types/profile";
import { PagedResponse } from "@/utils/helper/timeline";
import {
  InfiniteData,
  useMutation,
  UseMutationOptions
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMuteUnmuteUserMutation = (
  options?: UseMutationOptions<
    RelationShip,
    AxiosError,
    { accountId: string; toMute: boolean }
  >
) => {
  return useMutation({
    mutationFn: muteUnMuteUserMutationFn,
    onMutate: async ({ accountId, toMute }) => {
      await queryClient.cancelQueries({ queryKey: ["muted-user-list"] });

      const previousMutedUser = queryClient.getQueryData<
        MuteBlockUserAccount[]
      >(["muted-user-list"]);

      queryClient.setQueryData<
        InfiniteData<PagedResponse<MuteBlockUserAccount[]>>
      >(["muted-user-list"], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((user) => {
              if (user.id === accountId) {
                return { ...user, isUnMutedNow: !toMute };
              }
              return user;
            })
          }))
        };
      });

      return { previousMutedUser };
    },
    onError: (_, __, context: { previousRelationships?: RelationShip[] }) => {
      queryClient.setQueryData(
        ["muted-user-list"],
        context?.previousRelationships
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["muted-user-list"] });
    },
    ...options
  });
};

export const useBlockUnBlockUserMutation = (
  options?: UseMutationOptions<
    RelationShip,
    AxiosError,
    { accountId: string; toBlock: boolean }
  >
) => {
  return useMutation({
    mutationFn: blockUnBlockUserMutationFn,
    onMutate: async ({ accountId, toBlock }) => {
      await queryClient.cancelQueries({ queryKey: ["blocked-user-list"] });

      const previousMutedUser = queryClient.getQueryData<
        MuteBlockUserAccount[]
      >(["blocked-user-list"]);

      queryClient.setQueryData<
        InfiniteData<PagedResponse<MuteBlockUserAccount[]>>
      >(["blocked-user-list"], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((user) => {
              if (user.id === accountId) {
                return { ...user, isUnMutedNow: !toBlock };
              }
              return user;
            })
          }))
        };
      });

      return { previousMutedUser };
    },
    onError: (_, __, context: { previousRelationships?: RelationShip[] }) => {
      queryClient.setQueryData(
        ["blocked-user-list"],
        context?.previousRelationships
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-user-list"] });
    },
    ...options
  });
};
