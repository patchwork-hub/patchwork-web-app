import { getNotifications } from "@/services/notifications/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }) => getNotifications(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    refetchOnMount: "always",
  });
};
