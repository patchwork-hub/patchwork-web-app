import {
  getBlockedUserList,
  getMutedUserList
} from "@/services/settings/getMutedUserList";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetMutedUserList = () => {
  const queryKey = ["muted-user-list"];
  return useInfiniteQuery({
    queryKey,
    refetchOnMount: "always",
    queryFn: ({ pageParam }) => getMutedUserList(pageParam),
    getNextPageParam: (lastPage) => lastPage.max_id,
    initialPageParam: undefined,
  });
};

export const useGetBlockedUserList = () => {
  const queryKey = ["blocked-user-list"];
  return useInfiniteQuery({
    queryKey,
    refetchOnMount: "always",
    queryFn: ({ pageParam }) => getBlockedUserList(pageParam),
    getNextPageParam: (lastPage) => lastPage.max_id,
    initialPageParam: undefined,
  });
};
