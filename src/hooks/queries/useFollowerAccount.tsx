import { getFollowerAccounts } from "@/services/profile/following";
import { Account } from "@/types/patchwork";
import { useInfiniteQuery } from "@tanstack/react-query";

type FollowerResponse = {
  data: Account[];
  max_id: string | null;
}


export const useFollowerAccountsQuery = ({
  accountId,
  enabled,
}: {
  accountId: string;
  enabled: boolean;
}) => {
   return useInfiniteQuery<FollowerResponse, Error, FollowerResponse, string[], string | undefined>({
    queryKey: ["follower-accounts", accountId],
    queryFn: ({ pageParam }) =>
      getFollowerAccounts({ max_id: pageParam, accountId }),
    getNextPageParam: (lastPage) => lastPage.max_id,
    initialPageParam: undefined,
    retry: false,
    enabled,
  });
};