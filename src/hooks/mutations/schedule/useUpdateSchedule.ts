import { updateSchedule } from "@/services/schedule/schedule"
import { useMutation } from "@tanstack/react-query"

export const useUpdateSchedule = () => {
    return useMutation({
        mutationFn: updateSchedule,
    })
}