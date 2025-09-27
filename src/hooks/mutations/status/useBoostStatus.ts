import {
  useMutation,
  useQueryClient,
  QueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { BoostActionParams, boostStatus } from "@/services/status/statuses";
import { Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

type StatusListResponse ={
  statuses: Status[] | { data: Status[] };
  [key: string]: unknown;
}

type ContextData ={
  ancestors: Status[];
  descendants: Status[];
  [key: string]: unknown;
}

type SearchData ={
  accounts: unknown[];
  statuses: Status[];
  hashtags: unknown[];
  [key: string]: unknown;
}

type SnapshotType = [
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>,
  ReturnType<QueryClient["getQueriesData"]>
];

export const useBoostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, BoostActionParams, SnapshotType>({
    mutationFn: boostStatus,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });

      const previousStatusList = queryClient.getQueriesData({
        queryKey: ["statusList"],
      });
      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getBoostUpdaterFn(id)
      );

      const previousStatusData = queryClient.getQueriesData({
        queryKey: ["status"],
      });
      queryClient.setQueriesData(
        { queryKey: ["status"] },
        getBoostStatusUpdaterFn(id)
      );

      const previousContextData = queryClient.getQueriesData({
        queryKey: ["context"],
      });
      queryClient.setQueriesData(
        { queryKey: ["context"] },
        getBoostContextUpdaterFn(id)
      );

      const previousSearchData = queryClient.getQueriesData({
        queryKey: ["search-all"],
      });
      queryClient.setQueriesData(
        { queryKey: ["search-all"] },
        getBoostSearchUpdaterFn(id)
      );

      return [
        previousStatusList,
        previousStatusData,
        previousContextData,
        previousSearchData,
      ];
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
    },
    onError: (err, { id }, snapshot) => {
      if (!snapshot) return;
      
      snapshot.forEach((queryData) => {
        queryData?.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-all"] });
    },
  });
};

const getBoostUpdaterFn = (id: string) => (old: InfiniteData<StatusListResponse> | undefined) => {
  if (!old?.pages) return old;

  const pages = old.pages.map((page: StatusListResponse) => {
    const statusesArray = Array.isArray(page.statuses)
      ? page.statuses
      : (page.statuses as { data: Status[] })?.data;

    if (!statusesArray) return page;

    const updatedStatuses = statusesArray.map((status: Status) => 
      getBoostStatusUpdaterFn(id)(status)
    );

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

const getBoostStatusUpdaterFn = (id: string) => (old: Status | undefined): Status | undefined => {
  if (!old) return old;
  
  if (old.id === id) {
    return {
      ...old,
      reblogged: true,
      reblogs_count: (old.reblogs_count || 0) + 1,
    };
  }
  
  // Handle reblogged status
  if (old.reblog && old.reblog.id === id) {
    return {
      ...old,
      reblog: {
        ...old.reblog,
        reblogged: true,
        reblogs_count: (old.reblog.reblogs_count || 0) + 1,
      },
    };
  }
  
  return old;
};

const getBoostContextUpdaterFn = (id: string) => (old: ContextData | undefined) => {
  if (!old) return old;
  
  return {
    ...old,
    ancestors: old.ancestors?.map(getBoostStatusUpdaterFn(id)) || [],
    descendants: old.descendants?.map(getBoostStatusUpdaterFn(id)) || [],
  };
};

const getBoostSearchUpdaterFn = (id: string) => (old: SearchData | undefined) => {
  if (!old?.statuses) return old;
  
  return {
    ...old,
    statuses: old.statuses.map(getBoostStatusUpdaterFn(id)),
  };
};