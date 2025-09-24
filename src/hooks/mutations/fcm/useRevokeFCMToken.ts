import { revokeFCMToken } from "@/services/fcm/revokeFCMToken"
import { useMutation } from "@tanstack/react-query"

export const useRevokeFCMToken = ()=>{
    return useMutation({
        mutationFn:revokeFCMToken,
    })
}