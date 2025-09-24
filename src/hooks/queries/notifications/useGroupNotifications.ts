import { getGroupedNotifications } from "@/services/notifications/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";

type GroupedNotificationResults = {
  enabled?: boolean;
};

export const useGroupedNotifications = (
  options: GroupedNotificationResults = {}
) => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => 
      getGroupedNotifications(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextMaxId,
    enabled: options.enabled ?? true,
  });
};
