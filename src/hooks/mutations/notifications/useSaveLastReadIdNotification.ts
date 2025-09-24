import { saveLastReadIdNotification } from "@/services/notifications/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveLastReadIdNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["save-last-read-id-notification"],
    mutationFn: saveLastReadIdNotification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notification-marker"],
      });
      console.log("Notification marker updated successfully", data);
    },
    onError: (error) => {
      console.error("Failed to update notification marker", error);
    },
  });
};
