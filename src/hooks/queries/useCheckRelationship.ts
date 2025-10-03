import { checkRelationshipQueryFn } from "@/services/profile/relationship";
import { RelationShip } from "@/types/profile";
import { CheckRelationshipQueryKey } from "@/types/queries/profile.type";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export const useCheckRelationships = ({
  options,
  ...queryParam
}: CheckRelationshipQueryKey[1] & {
  options?: QueryOptionHelper<RelationShip[] | undefined>;
}) => {
  const queryKey: CheckRelationshipQueryKey = [
    "check-relationship-to-other-accounts",
    queryParam
  ];
  return useQuery({
    queryKey,
    queryFn:(context) => checkRelationshipQueryFn(context as QueryFunctionContext<CheckRelationshipQueryKey>),
    ...options
  });
};
