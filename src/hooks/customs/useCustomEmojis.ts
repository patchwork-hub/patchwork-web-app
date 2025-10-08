import { useCustomEmojiStore } from "@/components/organisms/compose/store/useCustomEmojiStore";
import { getCustomEmojis } from "@/services/custom_emojis/emojis";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCustomEmojis() {

    const { setLoading, setEmojis } = useCustomEmojiStore();

    const { data, isLoading, ...rest } = useQuery({
        queryKey: ['customEmojis'],
        queryFn: getCustomEmojis,
    });

    useEffect(() => {
        if (data) {
            setEmojis(data);
        }
        setLoading(isLoading);
    }, [data, isLoading, setEmojis, setLoading]);

    return {
        data, isLoading, ...rest
    }
}