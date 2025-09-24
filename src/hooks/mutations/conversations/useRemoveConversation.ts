import { ConversationListResponse, removeConversation } from "@/services/conversations/conversations";
import { ErrorResponse } from "@/types/error";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useRemoveConversation = () => {
    const queryClient = useQueryClient();
    return useMutation<void, AxiosError<ErrorResponse>, string>({
        mutationFn: removeConversation,
        onMutate: async (conversationId) => {
            // Cancel any outgoing queries for the conversation
            await queryClient.cancelQueries({ queryKey: ["conversations"] });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData(["conversations"]);

            // Optimistically update the cache
            queryClient.setQueryData(["conversations"], (old: { pages: ConversationListResponse[], pageParams: any[] }) => {
                if (!old) return old;
                const pages = old.pages?.map(page => ({
                    ...page,
                    conversations: page.conversations.filter(conversation => conversation.id !== conversationId),
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