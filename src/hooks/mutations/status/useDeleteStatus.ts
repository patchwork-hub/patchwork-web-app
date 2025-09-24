import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { deleteStatus } from '@/services/status/statuses';
import { Status } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useDeleteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<Status, AxiosError<ErrorResponse>, { id: string; deleteMedia: boolean }>({
        mutationFn: ({ id, deleteMedia }) => deleteStatus(id, deleteMedia),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ['statusList'] });

            const previousData = queryClient.getQueriesData({
                queryKey: ['statusList']
            });

            queryClient.setQueriesData({
                queryKey: ['statusList']
            }, getDeleteUpdaterFn(id));

            return previousData;
        },
        onError: (err, variables, previousData: ReturnType<QueryClient['getQueriesData']>) => {
            if (previousData) {
                previousData.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['statusList'] });
            queryClient.invalidateQueries({ queryKey: ['status'] });
            queryClient.invalidateQueries({ queryKey: ['context'] });
        },
    });
};

const getDeleteUpdaterFn = (id: string) => (old: any) => {
    if (!old || !old.pages) return old;

    const pages = old.pages.map((page: any) => ({
        ...page,
        statuses: page.statuses.filter((status: Status) => status.id !== id),
    }));

    return {
        pages,
        pageParams: old.pageParams,
    };
};
