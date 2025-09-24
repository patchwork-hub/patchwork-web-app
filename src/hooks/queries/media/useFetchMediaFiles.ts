import { useQuery } from '@tanstack/react-query';
import { fetchMediaFiles } from '@/services/media/fetchMediaFiles';
import { Media } from '@/types/status';
import { ErrorResponse } from '@/types/error';

export const useFetchMediaFiles = (mediaAttachments: Media[]) => {
    return useQuery<File[], ErrorResponse>({
        queryKey: ['mediaFiles', mediaAttachments],
        queryFn: () => fetchMediaFiles(mediaAttachments)
    });
};
