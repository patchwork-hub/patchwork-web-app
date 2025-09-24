import http from "@/lib/http";
import { Media } from "@/types/status";

export const uploadMedia = async (file: File, description?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    const response = await http.post('/api/v2/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}