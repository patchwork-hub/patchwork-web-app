import { getDrafts } from "@/services/draft/draft"
import { DraftStatusesResponse } from "@/types/draft"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetStatusDrafts = () => {
    return useQuery<DraftStatusesResponse, AxiosError<{ error: string }>>({
        queryKey: ['statusDrafts'],
        queryFn: getDrafts,
    })
}