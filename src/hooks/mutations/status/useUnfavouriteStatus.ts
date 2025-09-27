import {
  useMutation,
  useQueryClient,
  QueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import {
  StatusActionParams,
  unfavouriteStatus,
} from "@/services/status/statuses";
import { Context, Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type PaginatedStatuses = {
  statuses: Status[] | { data: Status[] };
  [key: string]: unknown;
}

type SnapshotType = [
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>
];


export const useUnfavouriteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, StatusActionParams, SnapshotType>({
    mutationFn: unfavouriteStatus,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });

      const previousStatusList = queryClient.getQueriesData({
        queryKey: ["statusList"],
      });

      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getUnfavUpdaterFn(id)
      );
      const previousStatusData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["status"],
        });

      queryClient.setQueriesData(
        {
          queryKey: ["status"],
        },
        getUpdater(id)
      );

      const previousContextData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["context"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["context"],
        },
        getUnfavContextUpdaterFn(id)
      );

      const previousSearchData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["search-all"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["search-all"],
        },
        getFavSearchUpdaterFn(id)
      );

      return [
        previousStatusList,
        previousStatusData,
        previousContextData,
        previousSearchData,
      ];
    },
    onError: (
      err,
      variables,
      snapshot
    ) => {
      snapshot?.forEach((it) => {
        it?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
      queryClient.invalidateQueries({ queryKey: ["context"] });
      queryClient.invalidateQueries({ queryKey: ["search-all"] });
    },
  });
};

const getUnfavUpdaterFn =
  (id: string) =>
  (old: InfiniteData<PaginatedStatuses> | undefined) => {
    if (!old?.pages) return old;

    const pages = old.pages.map((page) => {
      const statusesArray = Array.isArray(page.statuses)
        ? page.statuses
        : page.statuses?.data;

      if (!statusesArray) return page;

      const updatedStatuses = statusesArray.map(getUpdater(id));

      return {
        ...page,
        statuses: Array.isArray(page.statuses)
          ? updatedStatuses
          : { ...page.statuses, data: updatedStatuses },
      };
    });

    return {
      pages,
      pageParams: old.pageParams,
    };
  };

const getUnfavContextUpdaterFn = (id: string) => (old: Context) => ({
  ancestors: old.ancestors.map(getUpdater(id)),
  descendants: old.descendants.map(getUpdater(id)),
});

const getFavSearchUpdaterFn =
  (id: string) =>
  (old: { accounts: unknown[]; statuses: Status[]; hashtags: unknown[] }) => {
    if (!old) return old;
    return {
      ...old,
      statuses: old.statuses.map(getUpdater(id)),
    };
  };

const getUpdater = (id: string) => (status: Status) => {
  if (!status) return status;
  if (status.id === id) {
    return {
      ...status,
      favourited: false,
      favourites_count: status.favourites_count - 1,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        favourited: false,
        favourites_count: status.reblog.favourites_count - 1,
      },
    };
  }
  return status;
};
