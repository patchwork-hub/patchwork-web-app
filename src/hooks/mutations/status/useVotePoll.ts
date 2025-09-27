import { useMutation, useQueryClient, QueryClient, InfiniteData } from '@tanstack/react-query';
import { votePoll } from '@/services/poll';
import type { Poll, Status } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

interface PaginatedStatuses {
  statuses: Status[];
  [key: string]: unknown;
}

type SnapshotType = ReturnType<QueryClient['getQueriesData']>;

export const useVotePoll = () => {
  const queryClient = useQueryClient();

  return useMutation<Poll, AxiosError<ErrorResponse>, { id: string, choices: number[] }, SnapshotType>({
    mutationFn: ({ id, choices }) => votePoll({ id, choices }),
    onMutate: async ({ id, choices }) => {
      await queryClient.cancelQueries({ queryKey: ['statusList'] });

      const previousData = queryClient.getQueriesData({
        queryKey: ['statusList']
      });

      queryClient.setQueriesData(
        { queryKey: ['statusList'] },
        getVoteUpdaterFn(id, choices)
      );

      return previousData;
    },
    onError: (err, variables, previousData) => {
      if (previousData) {
        previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
    
      queryClient.invalidateQueries({ queryKey: ['statusList'] });
      queryClient.invalidateQueries({ queryKey: ['status'] });
    },
  });
};

const getVoteUpdaterFn = (id: string, choices: number[]) => (old: InfiniteData<PaginatedStatuses> | undefined) => {
  if (!old?.pages) return old;

  const pages = old.pages.map((page: PaginatedStatuses) => ({
    ...page,
    statuses: page.statuses?.map((status: Status) => updateStatusPoll(status, id, choices)) || [],
  }));

  return {
    pages,
    pageParams: old.pageParams ?? [],
  };
};

const updateStatusPoll = (status: Status, pollId: string, choices: number[]): Status => {

  if (status.poll && status.poll.id === pollId) {
    return {
      ...status,
      poll: updatePoll(status.poll, choices),
    };
  }
  

  if (status.reblog && status.reblog.poll && status.reblog.poll.id === pollId) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        poll: updatePoll(status.reblog.poll, choices),
      },
    };
  }
  
  return status;
};

const updatePoll = (poll: Poll, choices: number[]): Poll => {
  return {
    ...poll,
    options: poll.options.map((option, index) => ({
      ...option,
      votes_count: choices.includes(index) 
        ? (option.votes_count || 0) + 1 
        : option.votes_count,
    })),
    own_votes: choices,
    voted: true,
    votes_count: (poll.votes_count || 0) + choices.length,
    voters_count: (poll.voters_count || 0) + 1,
  };
};