import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { Media } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { uploadMedia } from '@/services/media/uploadMedia';
import { AxiosError } from 'axios';

type Params = { file: File; description: string; };

export type UploadMediaMutation = UseMutationResult<
    Media,
    AxiosError<ErrorResponse>,
    Params
>;

export const useUploadMedia = () => {
    return useMutation<Media, AxiosError<ErrorResponse>, Params>(
        {
            mutationFn: ({ file, description }) => uploadMedia(file, description),
            mutationKey: ['uploadMedia'],
        }
    );
};
