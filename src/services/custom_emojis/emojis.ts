import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import http from "@/lib/http";

export async function getCustomEmojis() {
    const response = await http.get<MastodonCustomEmoji[]>('/api/v1/custom_emojis');
    return response.data;
}