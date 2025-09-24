import { useQuery } from "@tanstack/react-query";
import { NotificationRequest } from "@/types/conversation";
import { getNotificationRequests } from "@/services/notifications/notifications";

export const useNotificationRequests = () => {
    return useQuery<NotificationRequest[]>({
        queryKey: ["notification-requests"],
        queryFn: getNotificationRequests,
    });
};