import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { AccountRelationship } from '@/types/status';
import { blockAccount } from '@/services/status/account';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useBlockAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<AccountRelationship, AxiosError<ErrorResponse>, Parameters<typeof blockAccount>[0]>({
        mutationFn: (id) => blockAccount(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['accountRelationship', id] });

            const previousData: ReturnType<QueryClient['getQueryData']> = queryClient.getQueryData(['accountRelationship', id]);

            queryClient.setQueryData(
                ['accountRelationship', id],
                getBlockUpdaterFn
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

const getBlockUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
    if (!old) return old;
    return old.map(it => ({ ...it, blocking: true }));
}