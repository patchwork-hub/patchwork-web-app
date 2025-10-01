import {
  StatusActionParams,
  unbookmarkStatus,
} from "@/services/status/statuses";
import { ErrorResponse } from "@/types/error";
import { Status } from "@/types/status";
import {
  InfiniteData,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

type SnapshotType = [
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>
];

type PaginatedStatuses = {
  statuses: Status[] | { data: Status[] };
  [key: string]: unknown;
}

type ContextData = {
  ancestors: Status[];
  descendants: Status[];
  [key: string]: unknown;
}

type SearchData = {
  accounts: unknown[];
  statuses: Status[];
  hashtags: unknown[];
  [key: string]: unknown;
}


export const useUnbookmarkStatus = () => {
  const queryClient = useQueryClient();

  const commonMutationConfig = {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
      queryClient.invalidateQueries({ queryKey: ["context"] });
      queryClient.invalidateQueries({ queryKey: ["search-all"] });
    },
  };

  return useMutation<Status, AxiosError<ErrorResponse>, StatusActionParams, SnapshotType>({
    mutationFn: unbookmarkStatus,
    ...commonMutationConfig,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });

      const previousStatusList = queryClient.getQueriesData({
        queryKey: ["statusList"],
      });
      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getUnbookmarkUpdaterFn(id)
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
        getUnbookmarkContextUpdaterFn(id)
      );

      const previousSearchData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["search-all"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["search-all"],
        },
        getBookmarkSearchUpdaterFn(id)
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
      snapshot?.forEach((it) => {
        it?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      });
    },
  });
};

const getUnbookmarkUpdaterFn = (id: string) => (old: InfiniteData<PaginatedStatuses> | undefined) => {
  if (!old || !old.pages) return old;

  const pages = old.pages.map((page: PaginatedStatuses) => {
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
const getUnbookmarkContextUpdaterFn = (id: string) => (old: ContextData | undefined) => {
  if (!old) return old;
  return {
    ancestors: old.ancestors.map(getUpdater(id)),
    descendants: old.descendants.map(getUpdater(id)),
  };
};

const getBookmarkSearchUpdaterFn =
  (id: string) =>
  (old: SearchData | undefined)  => {
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
      bookmarked: false,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        bookmarked: false,
      },
    };
  }
  return status;
};
