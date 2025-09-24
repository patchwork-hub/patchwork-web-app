import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@/types/conversation";
import { getConversationByAccountId } from "@/services/conversations/conversations";

export const useGetConversationByAccountId = (accountId: string) => {
    return useQuery<Conversation>({
        queryKey: ["conversation", accountId],
        queryFn: () => getConversationByAccountId(accountId),
        refetchOnMount: "always",
    });
};