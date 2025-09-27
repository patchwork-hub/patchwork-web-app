import { useMutation, useQueryClient, QueryClient, InfiniteData } from '@tanstack/react-query';
import { deleteStatus } from '@/services/status/statuses';
import { Status } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

interface PaginatedStatuses {
  statuses: Status[];
  [key: string]: unknown;
}

type SnapshotType = ReturnType<QueryClient['getQueriesData']> | undefined;

export const useDeleteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, { id: string; deleteMedia: boolean }, SnapshotType>({
    mutationFn: ({ id, deleteMedia }) => deleteStatus(id, deleteMedia),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['statusList'] });

      const previousData = queryClient.getQueriesData({
        queryKey: ['statusList']
      });

      queryClient.setQueriesData(
        { queryKey: ['statusList'] },
        getDeleteUpdaterFn(id)
      );

      return previousData;
    },
    onError: (err, variables, snapshot) => {
      if (snapshot) {
        snapshot.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
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

const getDeleteUpdaterFn = (id: string) => (old: InfiniteData<PaginatedStatuses> | undefined) => {
  if (!old?.pages) return old;

  const pages = old.pages.map((page: PaginatedStatuses) => ({
    ...page,
    statuses: page.statuses?.filter((status: Status) => status.id !== id) || [],
  }));

  return {
    pages,
    pageParams: old.pageParams,
  };
};