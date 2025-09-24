import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { AccountRelationship } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { muteAccount } from '@/services/status/account';
import { AxiosError } from 'axios';

export const useMuteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<AccountRelationship, AxiosError<ErrorResponse>, Parameters<typeof muteAccount>[0]>({
        mutationFn: muteAccount,
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ['accountRelationship', id] });

            const previousData: ReturnType<QueryClient['getQueryData']> = queryClient.getQueryData(['accountRelationship', id]);

            queryClient.setQueryData(
                ['accountRelationship', id],
                muteUpdaterFn
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

const muteUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
    if (!old) return old;
    return old.map(it => ({ ...it, muting: true }));
}