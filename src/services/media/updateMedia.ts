import http from "@/lib/http";
import { Media } from "@/types/status";

export const updateMedia = async ({
    id,
    description,
    thumbnail,
}: {
    id: string;
    description?: string;
    thumbnail?: File;
}): Promise<Media> => {
    const formData = new FormData();
    if (description) formData.append('description', description);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    const response = await http.put(`/api/v1/media/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}