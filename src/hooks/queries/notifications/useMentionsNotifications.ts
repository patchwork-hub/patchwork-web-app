import { getMentionNotifications } from "@/services/notifications/notifications"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useMentionsNotifications = () => {
    return useInfiniteQuery({
        queryKey: ["mention-notifications"],
        queryFn: async ({ pageParam }) => getMentionNotifications(pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextMaxId,
    })
}