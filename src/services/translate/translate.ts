import http from "@/lib/http"
import { Translation } from "@/types/translate";

export const translate = async (id: string) => {
    const response = await http.post<Translation>(`/api/v1/statuses/${id}/translate`);
    return response.data;
}