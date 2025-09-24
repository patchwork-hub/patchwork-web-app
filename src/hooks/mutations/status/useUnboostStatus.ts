import { BoostActionParams, unboostStatus } from "@/services/status/statuses";
import { ErrorResponse } from "@/types/error";
import { Status } from "@/types/status";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// Define the expected structure for StatusListResponse based on previous context
interface StatusListResponse {
  statuses: Status[] | { data: Status[] };
}

export const useUnboostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Status,
    AxiosError<ErrorResponse>,
    Omit<BoostActionParams, "content" | "visibility">
  >({
    mutationFn: unboostStatus,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["statusList"] });
      const previousStatusList = queryClient.getQueriesData({
        queryKey: ["statusList"],
      });
      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getUnboostUpdaterFn(id)
      );

      const previousStatusData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["status"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["status"],
        },
        getUnboostStatusUpdaterFn(id)
      );

      const previousContextData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["context"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["context"],
        },
        getUnboostContextUpdaterFn(id)
      );

      const previousSearchData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["search-all"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["search-all"],
        },
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
    onError: (
      err,
      id,
      snapshot: ReturnType<QueryClient["getQueriesData"]>[]
    ) => {
      snapshot?.forEach((it) => {
        it?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      });
    },
  });
};

const getUnboostUpdaterFn =
  (id: string) =>
  (old: { pages?: StatusListResponse[]; pageParams?: any[] } | undefined) => {
    if (!old?.pages) return old;

    const pages = old.pages.map((page) => {
      const statusesArray = Array.isArray(page.statuses)
        ? page.statuses
        : Array.isArray(page.statuses?.data)
        ? page.statuses.data
        : null;

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
      pageParams: old.pageParams ?? [],
    };
  };

const getUnboostStatusUpdaterFn = (id: string) => (old: Status | undefined) =>
  old?.id === id
    ? ({
        ...old,
        reblogged: false,
        reblogs_count: old.reblogs_count - 1,
      } as Status)
    : old;

const getUnboostContextUpdaterFn =
  (id: string) =>
  (old: { ancestors: Status[]; descendants: Status[] } | undefined) => {
    if (!old) return old;
    return {
      ancestors: old.ancestors.map((status: Status) => {
        if (status.id === id) {
          return {
            ...status,
            reblogged: false,
            reblogs_count: status.reblogs_count - 1,
          } as Status;
        }
        return status;
      }),
      descendants: old.descendants.map((status: Status) => {
        if (status.id === id) {
          return {
            ...status,
            reblogged: false,
            reblogs_count: status.reblogs_count - 1,
          } as Status;
        }
        return status;
      }),
    };
  };

const getBoostSearchUpdaterFn =
  (id: string) =>
  (
    old: { accounts?: any[]; statuses?: Status[]; hashtags?: any[] } | undefined
  ) => {
    if (!old?.statuses) return old;
    return {
      ...old,
      statuses: old.statuses.map(getUpdater(id)),
    };
  };

const getUpdater = (id: string) => (status: Status | undefined) => {
  if (!status) return status;
  if (status.id === id) {
    return {
      ...status,
      reblogged: false,
      reblogs_count: status.reblogs_count - 1,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        reblogged: false,
        reblogs_count: status.reblog.reblogs_count - 1,
      },
    };
  }
  return status;
};
