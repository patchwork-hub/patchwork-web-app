import { viewAllConversations, ConversationListResponse } from "@/services/conversations/conversations";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useViewAllConversations = () => {
    return useInfiniteQuery<ConversationListResponse>({
        queryKey: ["conversations"],
        queryFn: async ({ pageParam }) => viewAllConversations({ max_id: pageParam as string | undefined }),
        getNextPageParam: (lastPage) => lastPage.nextMaxId,
        initialPageParam: undefined,
        refetchOnMount: "always"
    });
};