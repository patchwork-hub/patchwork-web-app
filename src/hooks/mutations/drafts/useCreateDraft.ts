import { createDraft } from "@/services/draft/draft";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateDraft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDraft,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey: ['statusDrafts']
            })
        }
    });
}