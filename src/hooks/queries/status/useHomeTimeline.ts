import { useInfiniteQuery } from "@tanstack/react-query";
import {
  StatusListResponse,
  fetchHomeTimeline,
} from "../../../services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type UseHomeTimelineOptions = {
  instanceUrl?: string;
  limit?: number;
  excludeReplies?: boolean;
  excludeDirect?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  local?: boolean;
  isCommunity?: boolean;
};

export const useHomeTimeline = ({
  instanceUrl,
  limit = 20,
  excludeReplies = false,
  excludeDirect = false,
  onlyMedia = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  remote = false,
  local = false,
  isCommunity = false,
}: UseHomeTimelineOptions) => {
  return useInfiniteQuery<StatusListResponse, AxiosError<ErrorResponse>>({
    queryKey: [
      "statusList",
      instanceUrl,
      limit,
      excludeReplies,
      onlyMedia,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      local,
      isCommunity,
    ],
    queryFn: async ({ pageParam }) =>
      fetchHomeTimeline({
        instanceUrl,
        limit,
        excludeReplies,
        onlyMedia,
        excludeReblogs,
        pageParam: pageParam as string | null | undefined,
        excludeOriginalStatuses,
        remote,
        local,
        excludeDirect,
        isCommunity,
      }),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
  });
};
