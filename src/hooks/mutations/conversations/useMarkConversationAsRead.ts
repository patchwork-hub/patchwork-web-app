import { ConversationListResponse, markConversationAsRead } from "@/services/conversations/conversations"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMarkConversationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markConversationAsRead,
        onMutate: async (conversationId: string) => {
            // Cancel any outgoing queries for the conversation
            await queryClient.cancelQueries({ queryKey: ["conversations"] });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData(["conversations"]);

            // Optimistically update the cache
            queryClient.setQueryData(["conversations"], (old: { pages: ConversationListResponse[], pageParams: unknown[] }) => {
                if (!old) return old;
                const pages = old.pages?.map(page => ({
                    ...page,
                    conversations: page.conversations.map(conversation => conversation.id === conversationId ? ({
                        ...conversation,
                        unread: false,
                    }) : conversation),
                }));
                return {
                    pages,
                    pageParams: old.pageParams
                }
            });

            return previousData;
        },
        onError: (error, conversationId, context) => {
            // Rollback to the previous value
            queryClient.setQueryData(["conversations"], context);
        }
    });
}