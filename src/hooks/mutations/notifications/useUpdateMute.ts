import { muteNotifications } from "@/services/notifications/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateMute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: muteNotifications,
        onMutate: async (mute) => {
            await queryClient.cancelQueries({
                queryKey: ["muteStatus"]
            });

            const previousMuteStatus = queryClient.getQueryData(["muteStatus"]);

            queryClient.setQueryData(["muteStatus"], (old: {mute: boolean}) => ({
                ...old,
                mute,
            }));

            return { previousMuteStatus };
        },
        onError: (err, mute, context) => {
            queryClient.setQueryData(["muteStatus"], context?.previousMuteStatus);
        }
    })
}