

import { saveFCMToken } from "@/services/fcm/saveFCMToken"
import { useMutation } from "@tanstack/react-query"

export const useSaveFCMToken = ()=>{
    return useMutation({
        mutationFn:saveFCMToken
    })
}