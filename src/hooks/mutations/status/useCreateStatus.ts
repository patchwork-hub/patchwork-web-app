import { createNewPost, CreatePostParams } from '@/services/status/statuses';
import { ErrorResponse } from '@/types/error';
import { Context, Status } from '@/types/status';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<Status, AxiosError<ErrorResponse>, CreatePostParams>({
        mutationFn: createNewPost,
        mutationKey: ['newStatus'],
        onMutate: async ({ formData }) => {
            if (!formData.in_reply_to_id) return;
            await queryClient.cancelQueries({ queryKey: ['statusList'] });

            const previousStatusList = queryClient.getQueriesData({
                queryKey: ['statusList']
            });
            queryClient.setQueriesData({
                queryKey: ['statusList']
            }, getReplyStatusListUpdaterFn(formData.in_reply_to_id));

            const previousStatusData: ReturnType<QueryClient['getQueriesData']> = queryClient.getQueriesData({
                queryKey: ['status'],
            });
            queryClient.setQueriesData({
                queryKey: ['status']
            }, getUpdater(formData.in_reply_to_id));

            const previousContextData: ReturnType<QueryClient['getQueriesData']> = queryClient.getQueriesData({
                queryKey: ['context'],
            });

            queryClient.setQueriesData({
                queryKey: ['context']
            }, getContextUpdater(formData.in_reply_to_id));

            return [
                previousStatusList,
                previousStatusData,
                previousContextData
            ];
        },
        onError: (err, variables, snapshot: ReturnType<QueryClient['getQueriesData']>[]) => {
            snapshot?.forEach((it) => {
                it?.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            queryClient.invalidateQueries({ queryKey: ['statusList'] });
            queryClient.invalidateQueries({ queryKey: ['context'] });
        }
    });
};

const getReplyStatusListUpdaterFn = (id: string) => (old: any) => {
    if (!old || !old.pages) return old;

    const pages = old.pages.map((page: any) => ({
        ...page,
        statuses: page.statuses.map(getUpdater(id)),
    }));

    return {
        pages,
        pageParams: old.pageParams,
    };
}

const getContextUpdater = (id: string) => (old: Context): Context => {
    if (!old) return old;
    return {
        ancestors: old.ancestors.map(getUpdater(id)),
        descendants: old.descendants.map(getUpdater(id)),
    };
}

const getUpdater = (id: string) => (status: Status) => {
    if (!status) return status;
    if (status.id === id) {
        return {
            ...status,
            replies_count: status.replies_count + 1,
        };
    } else if (status.reblog && status.reblog.id === id) {
        return {
            ...status,
            reblog: {
                ...status.reblog,
                replies_count: status.reblog.replies_count + 1,
            },
        };
    }
    return status;
}