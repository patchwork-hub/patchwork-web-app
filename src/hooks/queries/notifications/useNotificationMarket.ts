import { useQuery } from "@tanstack/react-query";
import { getNotificationMarker } from "@/services/notifications/notifications";
import { NotificationMarker } from "@/types/notification";

type NotificationMarkerOptions = {
  enabled?: boolean;
}

export const useNotificationMarker = (
  options: NotificationMarkerOptions = {}
) => {
  return useQuery<NotificationMarker>({
    queryKey: ["notification-marker"],
    queryFn: getNotificationMarker,
    enabled: options.enabled ?? true,
  });
};
