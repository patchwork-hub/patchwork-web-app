import { getMentionNotifications } from "@/services/notifications/notifications"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useMentionsNotifications = () => {
    return useInfiniteQuery({
        queryKey: ["mention-notifications"],
        queryFn: (context: { pageParam?: string }) => 
            getMentionNotifications(context.pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextMaxId,
    })
}