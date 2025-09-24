import { useInfiniteQuery } from "@tanstack/react-query";
import {
  StatusListResponse,
  fetchListTimeline,
} from "../../../services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type UseListTimelineOptions = {
  limit?: number;
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  id: string | number;
};

export const useListTimeline = ({
  limit = 20,
  excludeReplies = false,
  onlyMedia = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  remote = false,
  id,
}: UseListTimelineOptions) => {
  return useInfiniteQuery<StatusListResponse, AxiosError<ErrorResponse>>({
    queryKey: [
      "statusList",
      limit,
      excludeReplies,
      onlyMedia,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      id,
    ],
    queryFn: async ({ pageParam }) =>
      fetchListTimeline({
        limit,
        excludeReplies,
        onlyMedia,
        excludeReblogs,
        pageParam,
        excludeOriginalStatuses,
        remote,
        id,
      }),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
  });
};
