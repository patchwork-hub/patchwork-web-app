import { deleteSchedule } from "@/services/schedule/schedule"
import { Schedule } from "@/types/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSchedule,
        onMutate: (id: string) => {
            const previousSchedules = queryClient.getQueryData(["schedules"]);
            queryClient.setQueryData(["schedules"], (old: Schedule[]): Schedule[] => {
                return old.filter((schedule) => schedule.id !== id);
            });
            return { previousSchedules };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["schedules"], context?.previousSchedules);
        },
    })
}