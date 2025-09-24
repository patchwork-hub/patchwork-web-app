import { updateMedia } from "@/services/media/updateMedia"
import { ErrorResponse } from "@/types/error"
import { Media } from "@/types/status"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useUpdateMedia = () => {
    return useMutation<Media, AxiosError<ErrorResponse>, Parameters<typeof updateMedia>[0]>({
        mutationFn: async (params) => updateMedia(params),
    })
}