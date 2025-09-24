import { GifvResponse } from "@/types/gifv";
import axios from "axios";

export const getGifv = async (query: string, pos: string) => {
    const response = await axios.get<GifvResponse>('/api/tenor', {
        params: {
            query,
            pos,
        },
    });
    return response.data;
}