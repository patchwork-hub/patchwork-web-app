import { getDraft } from "@/services/draft/draft"
import { DraftStatusItem } from "@/types/draft"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetStatusDraft = (id: string) => {
    return useQuery<DraftStatusItem, AxiosError<{ error: string }>>({
        queryKey: ['statusDraft'],
        queryFn: () => getDraft(id),
    })
}