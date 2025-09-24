import { useInfiniteQuery } from "@tanstack/react-query";
import {
  StatusListResponse,
  fetchHashtagTimeline,
} from "../../../services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type UseHomeTimelineOptions = {
  limit?: number;
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  hashtag: string;
};

export const useHashtagTimeline = ({
  limit = 20,
  excludeReplies = false,
  onlyMedia = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  remote = false,
  hashtag,
}: UseHomeTimelineOptions) => {
  return useInfiniteQuery<StatusListResponse, AxiosError<ErrorResponse>>({
    queryKey: [
      "statusList",
      limit,
      excludeReplies,
      onlyMedia,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      hashtag,
    ],
    queryFn: async ({ pageParam }) =>
      fetchHashtagTimeline({
        limit,
        excludeReplies,
        onlyMedia,
        excludeReblogs,
        pageParam,
        excludeOriginalStatuses,
        remote,
        hashtag,
      }),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
  });
};
