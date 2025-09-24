import http from "@/lib/http";
import { RelationShip } from "@/types/profile";
import { CheckRelationshipQueryKey } from "@/types/queries/profile.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const checkRelationshipQueryFn = async (
  qfContext: QueryFunctionContext<CheckRelationshipQueryKey>
) => {
  try {
    const { accountIds } = qfContext.queryKey[1];
    const resp: AxiosResponse<RelationShip[]> = await http.get(
      `/api/v1/accounts/relationships`,
      {
        params: { with_suspended: true, id: accountIds }
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const relationshipQueryFn = async ({
  accountId,
  isFollowing
}: {
  accountId: string;
  isFollowing: boolean;
}) => {
  try {
    const relation = isFollowing ? "unfollow" : "follow";
    const resp: AxiosResponse<RelationShip> = await http.post(
      `/api/v1/accounts/${accountId}/${relation}`,
      !isFollowing && { reblogs: true }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};
