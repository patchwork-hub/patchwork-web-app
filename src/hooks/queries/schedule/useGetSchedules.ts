import { getSchedules } from "@/services/schedule/schedule"
import { useQuery } from "@tanstack/react-query"

export const useGetSchedules = () => {
    return useQuery({
        queryKey: ["schedules"],
        queryFn: getSchedules
    })
}