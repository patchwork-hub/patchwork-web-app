import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { MastodonCustomEmoji } from "../tools/Emoji";

export type CustomEmojiState = {
    emojis: MastodonCustomEmoji[] | undefined;
    loading: boolean;
    setEmojis: (data: MastodonCustomEmoji[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useCustomEmojiStore = create<CustomEmojiState>()(
    persist(
        (set, get) => ({
            emojis: undefined,
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            setEmojis: (emojis: MastodonCustomEmoji[]) => set({ emojis }),
            reset: () => set({ emojis: undefined })
        }),
        {
            name: 'custom-emoji-storage',
            storage: createJSONStorage(() => localStorage),
        },
    )
);