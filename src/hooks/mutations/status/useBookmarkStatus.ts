import {
  useMutation,
  useQueryClient,
  QueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { bookmarkStatus, StatusActionParams } from "@/services/status/statuses";
import { Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
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

export const useBookmarkStatus = () => {
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
    mutationFn: bookmarkStatus,
    ...commonMutationConfig,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });

      const previousStatusList = queryClient.getQueriesData({
        queryKey: ["statusList"],
      });
      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getBookmarkStatusListUpdaterFn(id)
      );

      const previousStatusData = queryClient.getQueriesData({
        queryKey: ["status"],
      });
      queryClient.setQueriesData(
        { queryKey: ["status"] },
        getUpdater(id)
      );

      const previousContextData = queryClient.getQueriesData({
        queryKey: ["context"],
      });
      queryClient.setQueriesData(
        { queryKey: ["context"] },
        getBookmarkContextUpdaterFn(id)
      );

      const previousSearchData = queryClient.getQueriesData({
        queryKey: ["search-all"],
      });
      queryClient.setQueriesData(
        { queryKey: ["search-all"] },
        getBookmarkSearchUpdaterFn(id)
      );

      return [
        previousStatusList,
        previousStatusData,
        previousContextData,
        previousSearchData,
      ];
    },
    onError: (err, _, snapshot) => {
      if (!snapshot) return;
      snapshot.forEach((queryData) => {
        queryData?.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      });
    },
  });
};

const getBookmarkStatusListUpdaterFn = (id: string) => (old: InfiniteData<PaginatedStatuses> | undefined) => {
  if (!old || !old.pages) return old;

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
    pageParams: old.pageParams,
  };
};

const getBookmarkContextUpdaterFn = (id: string) => (old: ContextData | undefined) => {
  if (!old) return old;
  return {
    ...old,
    ancestors: old.ancestors?.map(getUpdater(id)) || [],
    descendants: old.descendants?.map(getUpdater(id)) || [],
  };
};

const getBookmarkSearchUpdaterFn = (id: string) => (old: SearchData | undefined) => {
  if (!old) return old;
  return {
    ...old,
    statuses: old.statuses.map(getUpdater(id)),
  };
};

const getUpdater = (id: string) => (status: Status): Status => {
  if (!status) return status;
  
  if (status.id === id) {
    return {
      ...status,
      bookmarked: true,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        bookmarked: true,
      },
    };
  }
  return status;
};