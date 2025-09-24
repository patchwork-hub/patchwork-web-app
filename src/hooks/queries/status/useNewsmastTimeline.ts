import { useInfiniteQuery } from "@tanstack/react-query";
import {
  StatusListResponse,
  fetchNewsmastTimeline,
} from "../../../services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type UseAccountStatusesOptions = {
  limit?: number;
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
};

export const useNewsmastTimeline = (
  accountId: string,
  {
    limit = 20,
    excludeReplies = false,
    onlyMedia = false,
    excludeReblogs = false,
    excludeOriginalStatuses = false,
  }: UseAccountStatusesOptions = {}
) => {
  return useInfiniteQuery<StatusListResponse, AxiosError<ErrorResponse>>({
    queryKey: [
      "statusList",
      accountId,
      limit,
      excludeReplies,
      onlyMedia,
      excludeReblogs,
      excludeOriginalStatuses,
    ],
    queryFn: async ({ pageParam }) =>
      fetchNewsmastTimeline({
        accountId,
        limit,
        excludeReplies,
        onlyMedia,
        excludeReblogs,
        pageParam,
        excludeOriginalStatuses,
      }),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
  });
};
