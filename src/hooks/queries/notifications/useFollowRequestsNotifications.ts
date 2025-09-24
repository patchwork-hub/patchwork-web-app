import { getFollowRequestNotifications } from "@/services/notifications/notifications"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useFollowRequestsNotifications = () => {
    return useInfiniteQuery({
        queryKey: ["follow-requests-notifications"],
        queryFn: async ({ pageParam }) => getFollowRequestNotifications(pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextMaxId,
    })
}