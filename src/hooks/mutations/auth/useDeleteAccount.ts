import { deleteAccount } from "@/services/auth/deleteAccount"
import { useMutation } from "@tanstack/react-query"

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: deleteAccount
    })
}