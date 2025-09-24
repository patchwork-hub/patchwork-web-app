import http from "@/lib/http";
import { Conversation } from "@/types/conversation";
import { getMaxId } from "@/utils";

export type ConversationListResponse = {
    conversations: Conversation[];
    nextMaxId: string | null;
};

export const viewAllConversations = async ({
    max_id,
    limit = 20,
}): Promise<ConversationListResponse> => {
    const params: Record<string, any> = { limit };
    if (max_id) {
        params.max_id = max_id;
    }

    const response = await http.get<Conversation[]>("/api/v1/conversations", { params });

    return {
        conversations: response.data,
        nextMaxId:getMaxId(response.headers["link"]),
    };
};

export const removeConversation = async (conversationId: string) => {
    await http.delete(`/api/v1/conversations/${conversationId}`);
}

export const markConversationAsRead = async (conversationId: string) => {
    const res = await http.post<Conversation>(`/api/v1/conversations/${conversationId}/read`);
    return res.data;
}

export const getConversationByAccountId = async (accountId: string) => {
    const res = await http.get<Conversation>(`/api/v1/patchwork/conversations/check_conversation?target_account_id=${accountId}`);
    return res.data;
}