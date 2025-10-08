import { rejectFollowRequest } from "@/services/notifications/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRejectFollowRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectFollowRequest,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["follow-requests-notifications"],
            })
        },
    })
}