import { relationshipQueryFn } from "@/services/profile/relationship";
import { RelationShip } from "@/types/profile";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUserRelationshipMutation = (
  options: UseMutationOptions<
    RelationShip,
    AxiosError,
    { accountId: string; isFollowing: boolean }
  >
) => {
  return useMutation({ mutationFn: relationshipQueryFn, ...options });
};
