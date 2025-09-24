import { updateDraft } from "@/services/draft/draft"
import { DraftStatusesResponse } from "@/types/draft";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDraft,
        onSuccess: (data, { id }) => {
            queryClient.setQueryData(['statusDrafts'], (old: DraftStatusesResponse | undefined) => {
                if (!old) return;
                return old.map(resp => ({
                    ...resp,
                    datas: resp.datas.map(draft => draft.id === id ? data : draft)
                }))
            })
        }
    })
}