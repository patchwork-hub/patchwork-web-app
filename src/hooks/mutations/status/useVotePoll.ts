import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { votePoll } from '@/services/poll';
import type { Poll, Status } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useVotePoll = () => {
    const queryClient = useQueryClient();

    return useMutation<Poll, AxiosError<ErrorResponse>, { id: string, choices: number[] }, ReturnType<QueryClient['getQueriesData']>>(
        {
            mutationFn: ({ id, choices }) => votePoll({ id, choices }),
            onMutate: async ({ id, choices }) => {
                await queryClient.cancelQueries({ queryKey: ['statusList'] });

                const previousData = queryClient.getQueriesData({
                    queryKey: ['statusList']
                });

                queryClient.setQueriesData({
                    queryKey: ['statusList']
                }, getVoteUpdaterFn(id, choices));

                return previousData;
            },
            onError: (err, variables, previousData: ReturnType<QueryClient['getQueriesData']>) => {
                if (previousData) {
                    previousData.forEach(([key, data]) => {
                        queryClient.setQueryData(key, data);
                    });
                }
            },
        }
    );
}

const getVoteUpdaterFn = (id: string, choices: number[]) => (old: any) => {
    if (!old || !old.pages) return old;

    const pages = old.pages.map((page: any) => ({
        ...page,
        statuses: page.statuses.map((status: Status) => {
            if (status.poll && status.poll.id === id) {
                return {
                    ...status,
                    poll: {
                        ...status.poll,
                        options: status.poll.options.map((option, idx) => {
                            if (choices.includes(idx)) {
                                return {
                                    ...option,
                                    votes_count: option.votes_count + 1,
                                };
                            }
                            return option;
                        }),
                        own_votes: choices,
                        voted: true,
                        votes_count: status.poll.votes_count + choices.length,
                        voters_count: status.poll.voters_count + 1,
                    },
                };
            } else if (status.reblog && status.reblog.poll && status.reblog.poll.id === id) {
                return {
                    ...status,
                    reblog: {
                        ...status.reblog,
                        poll: {
                            ...status.reblog.poll,
                            options: status.reblog.poll.options.map((option, idx) => {
                                if (choices.includes(idx)) {
                                    return {
                                        ...option,
                                        votes_count: option.votes_count + 1,
                                    };
                                }
                                return option;
                            }),
                            own_votes: choices,
                            voted: true,
                            votes_count: status.reblog.poll.votes_count + choices.length,
                            voters_count: status.reblog.poll.voters_count + 1,
                        },
                    },
                };
            }
            return status;
        }),
    }));

    return {
        pages,
        pageParams: old.pageParams,
    };
}