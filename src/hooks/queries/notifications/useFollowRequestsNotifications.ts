import { getFollowRequestNotifications } from "@/services/notifications/notifications"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useFollowRequestsNotifications = () => {
    return useInfiniteQuery({
        queryKey: ["follow-requests-notifications"],
         queryFn: (context: { pageParam?: string }) => 
            getFollowRequestNotifications(context.pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextMaxId,
    })
}