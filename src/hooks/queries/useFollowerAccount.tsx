import { getFollowerAccounts } from "@/services/profile/following";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFollowerAccountsQuery = ({
  accountId,
  enabled,
}: {
  accountId: string;
  enabled: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["follower-accounts", accountId],
    queryFn: ({ pageParam }) =>
      getFollowerAccounts({ max_id: pageParam, accountId }),
    getNextPageParam: (lastPage) => lastPage.max_id,
    initialPageParam: undefined,
    retry: false,
    enabled,
  });
};