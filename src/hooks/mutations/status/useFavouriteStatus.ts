import {
  useMutation,
  useQueryClient,
  QueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import {
  favouriteStatus,
  StatusActionParams,
} from "@/services/status/statuses";
import { Context, Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";
import { toast } from "sonner";


type PaginatedStatuses ={
  statuses: Status[] | { data: Status[] };
  [key: string]: unknown;
}

type SearchData = {
  accounts: unknown[];
  statuses: Status[];
  hashtags: unknown[];
  [key: string]: unknown;
}

type SnapshotType = [
  ReturnType<QueryClient['getQueriesData']>,
  ReturnType<QueryClient['getQueriesData']>,
  ReturnType<QueryClient['getQueriesData']>,
  ReturnType<QueryClient['getQueriesData']>
] | undefined;

export const useFavouriteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, StatusActionParams, SnapshotType>({
    mutationFn: favouriteStatus,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });

      const previousStatusList: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({ queryKey: ["statusList"] });
      queryClient.setQueriesData(
        {
          queryKey: ["statusList"],
        },
        getFavStatusListUpdaterFn(id)
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
        getFavContextUpdaterFn(id)
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
      _,
      snapshot
    ) => {
      const error = err?.response?.data?.error;
      if (error) {
        toast.error(error);
      }
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

const getFavStatusListUpdaterFn = (id: string) => (old: InfiniteData<PaginatedStatuses> | undefined) => {
  if (!old?.pages) return old;

  const pages = old.pages.map((page: PaginatedStatuses) => {
    const statusesArray = Array.isArray(page.statuses)
      ? page.statuses
      : (page.statuses as { data: Status[] })?.data;

    if (!statusesArray) return page;

    const updatedStatuses = statusesArray.map(getUpdater(id));

    return {
      ...page,
      statuses: Array.isArray(page.statuses)
        ? updatedStatuses
        : { ...(page.statuses as object), data: updatedStatuses },
    };
  });

  return {
    pages,
    pageParams: old.pageParams ?? [],
  };
};

const getFavContextUpdaterFn = (id: string) => (old: Context) => {
  if (!old) return old;
  return {
    ancestors: old.ancestors.map(getUpdater(id)),
    descendants: old.descendants.map(getUpdater(id)),
  };
};

const getFavSearchUpdaterFn = (id: string) => (old: SearchData | undefined): SearchData | undefined => {
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
      favourited: true,
      favourites_count: status.favourites_count + 1,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        favourited: true,
        favourites_count: status.reblog.favourites_count + 1,
      },
    };
  }
  return status;
};
