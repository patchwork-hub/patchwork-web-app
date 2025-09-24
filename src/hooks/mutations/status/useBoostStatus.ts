import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { BoostActionParams, boostStatus } from "@/services/status/statuses";
import { Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

// Assuming StatusListResponse from your previous context
interface StatusListResponse {
  statuses: Status[] | { data: Status[] };
}

export const useBoostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, BoostActionParams>({
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

      const previousStatusData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["status"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["status"],
        },
        getBoostStatusUpdaterFn(id)
      );

      const previousContextData: ReturnType<QueryClient["getQueriesData"]> =
        queryClient.getQueriesData({
          queryKey: ["context"],
        });
      queryClient.setQueriesData(
        {
          queryKey: ["context"],
        },
        getBoostContextUpdaterFn(id)
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
      { id },
      snapshot: ReturnType<QueryClient["getQueriesData"]>[]
    ) => {
      snapshot?.forEach((it) => {
        it?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-all"] });
    },
  });
};

const getBoostUpdaterFn =
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

      const updatedStatuses = statusesArray.map((status: Status) => {
        if (status.id === id) {
          return {
            ...status,
            reblogged: true,
            reblogs_count: status.reblogs_count + 1,
          };
        }
        return status;
      });

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

const getBoostStatusUpdaterFn = (id: string) => (old: Status | undefined) =>
  old?.id === id
    ? ({
        ...old,
        reblogged: true,
        reblogs_count: old.reblogs_count + 1,
      } as Status)
    : old;

const getBoostContextUpdaterFn =
  (id: string) =>
  (old: { ancestors: Status[]; descendants: Status[] } | undefined) => {
    if (!old) return old;
    return {
      ancestors: old.ancestors.map(getUpdater(id)),
      descendants: old.descendants.map(getUpdater(id)),
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
      reblogged: true,
      reblogs_count: status.reblogs_count + 1,
    };
  } else if (status.reblog && status.reblog.id === id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        reblogged: true,
        reblogs_count: status.reblog.reblogs_count + 1,
      },
    };
  }
  return status;
};
