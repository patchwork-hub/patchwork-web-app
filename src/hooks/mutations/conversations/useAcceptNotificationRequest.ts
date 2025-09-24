import { acceptNotificationRequest } from "@/services/notifications/notifications";
import { NotificationRequest } from "@/types/conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAcceptNotificationRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: acceptNotificationRequest,
        onMutate: (id: string) => {
            const previousValue = queryClient.getQueryData(["notification-requests"]);
            queryClient.setQueryData(["notification-requests"], (old: NotificationRequest[]) => {
                return old?.filter((item: NotificationRequest) => item.id !== id);
            });

            return previousValue;
        },
        onError: (err, variables, previousValue) => {
            queryClient.setQueryData(["notification-requests"], previousValue);
        }
    });
}