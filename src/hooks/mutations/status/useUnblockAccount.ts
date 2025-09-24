import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { AccountRelationship } from '@/types/status';
import { unblockAccount } from '@/services/status/account';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useUnblockAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<AccountRelationship, AxiosError<ErrorResponse>, Parameters<typeof unblockAccount>[0]>({
        mutationFn: (id) => unblockAccount(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['accountRelationship', id] });

            const previousData: ReturnType<QueryClient['getQueryData']> = queryClient.getQueryData(['accountRelationship', id]);

            queryClient.setQueryData(
                ['accountRelationship', id],
                getUnblockUpdaterFn
            );

            return previousData;
        },
        onError: (err, id, snapshot: ReturnType<QueryClient['getQueryData']>) => {
            if (snapshot) {
                queryClient.setQueryData(['accountRelationship', id], snapshot);
            }
        },
    });
}

const getUnblockUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
    if (!old) return old;
    return old.map(it => ({ ...it, blocking: false }));
}