import { useInfiniteQuery } from '@tanstack/react-query';
import { StatusListResponse, fetchAccountStatuses } from '../../../services/status/fetchAccountStatuses';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

type UseAccountStatusesOptions = {
  limit?: number;
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  onlyReblogs?: boolean;
}

export const useAccountStatuses = (
  accountId: string,
  {
    limit = 20,
    excludeReplies = false,
    onlyMedia = false,
    excludeReblogs = false,
    excludeOriginalStatuses = false,
    onlyReblogs = false
  }: UseAccountStatusesOptions = {}
) => {
  return useInfiniteQuery<StatusListResponse, AxiosError<ErrorResponse>>({
    queryKey: ['statusList', accountId, limit, excludeReplies, onlyMedia, excludeReblogs, excludeOriginalStatuses],
    queryFn: async ({ pageParam }) => fetchAccountStatuses({
      accountId,
      limit,
      excludeReplies,
      onlyMedia,
      excludeReblogs,
      pageParam,
      excludeOriginalStatuses,
      onlyReblogs
    }),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
    refetchOnMount: "always",
  });
};