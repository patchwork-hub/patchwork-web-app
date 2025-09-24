import { acceptFollowRequest } from "@/services/notifications/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAcceptFollowRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: acceptFollowRequest,
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({
                queryKey: ["follow-requests-notifications"],
            })
        },
    })
}