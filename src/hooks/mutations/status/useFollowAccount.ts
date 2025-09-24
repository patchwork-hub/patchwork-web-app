import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { AccountRelationship } from '@/types/status';
import { followAccount } from '@/services/status/account';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useFollowAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<AccountRelationship, AxiosError<ErrorResponse>, Parameters<typeof followAccount>[0]>({
        mutationFn: followAccount,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['accountRelationship', id] });

            const previousData: ReturnType<QueryClient['getQueryData']> = queryClient.getQueryData(['accountRelationship', id]);

            queryClient.setQueryData(
                ['accountRelationship', id],
                getFollowUpdaterFn
            );

            return previousData;
        },
        onError: (err, id, snapshot: any) => {
            if (snapshot) {
                queryClient.setQueryData(['accountRelationship', id], snapshot);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['accountRelationship'] });
        }
    });
}

const getFollowUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
    if (!old) return old;
    return old.map(it => ({ ...it, following: true }));
}