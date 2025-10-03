import { getFollowingAccounts } from "@/services/home-feed/followingAccountService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFollowingAccountsQuery = ({
  accountId,
  enabled,
}: {
  accountId: string;
  enabled: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["following-accounts", accountId],
    queryFn: ({ pageParam }) => 
      getFollowingAccounts({
        accountId,
        max_id: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.max_id,
    initialPageParam: undefined as string | undefined,
    enabled,
    retry: false,
  });
};
