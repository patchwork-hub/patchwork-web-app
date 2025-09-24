import { getPoll } from "@/services/poll";
import { useQuery } from "@tanstack/react-query";

export const useGetPoll = (id: string) => {
    return useQuery({
        queryKey:["poll", id],
        queryFn: ()=> getPoll(id),
    })
}