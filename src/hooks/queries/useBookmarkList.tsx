import { useInfiniteQuery } from "@tanstack/react-query";
import { StatusListResponse } from "../../services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";
import { getBookmarkList } from "@/services/profile/bookmark";

export const useBookmarkList = () => {
  return useInfiniteQuery<StatusListResponse | any, AxiosError<ErrorResponse>>({
    queryKey: ["statusList"],
    queryFn: async ({ pageParam }) => getBookmarkList(pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    initialPageParam: undefined,
  });
};
