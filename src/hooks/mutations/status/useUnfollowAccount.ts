import { unfollowAccount } from '@/services/status/account';
import { ErrorResponse } from '@/types/error';
import { AccountRelationship } from '@/types/status';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUnfollowAccount = () => {
    const queryClient = useQueryClient();

    return useMutation<AccountRelationship, AxiosError<ErrorResponse>, Parameters<typeof unfollowAccount>[0]>({
        mutationFn: unfollowAccount,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['accountRelationship', id] });

            const previousData: ReturnType<QueryClient['getQueryData']> = queryClient.getQueryData(['accountRelationship', id]);

            queryClient.setQueryData(
                ['accountRelationship', id],
                getUnfollowUpdaterFn
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

const getUnfollowUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
    if (!old) return old;
    return old.map(it => ({ ...it, following: false }));
}