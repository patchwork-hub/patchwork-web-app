import { Conversation } from "@/types/conversation";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export type ConversationState = {
    reset: () => void;
    conversation: Conversation | undefined;
    setConversation: (conversation: Conversation) => void;
}

export const useConversationStore = create<ConversationState>()(
    persist(
        (set) => ({
            conversation: undefined,
            setConversation: (conversation: Conversation) => set({ conversation }),
            reset: () => set({ conversation: undefined })
        }),
        {
            name: 'conversation',
            storage: createJSONStorage(() => localStorage),
        },
    )
);