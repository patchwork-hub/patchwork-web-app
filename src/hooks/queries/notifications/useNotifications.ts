import { getNotifications } from "@/services/notifications/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
     queryFn: (context: { pageParam?: string }) => 
            getNotifications(context.pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    refetchOnMount: "always",
  });
};
