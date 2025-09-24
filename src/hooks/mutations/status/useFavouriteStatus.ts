import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import {
  favouriteStatus,
  StatusActionParams,
} from "@/services/status/statuses";
import { Context, Status } from "@/types/status";
import { StatusListResponse } from "@/services/status/fetchAccountStatuses";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useFavouriteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Status, AxiosError<ErrorResponse>, StatusActionParams>({
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
      { id },
      snapshot: ReturnType<QueryClient["getQueriesData"]>[]
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

const getFavStatusListUpdaterFn =
  (id: string) =>
  (old: {
    pages?: Array<{ statuses: Status[] | any }>;
    pageParams?: any[];
  }) => {
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

const getFavContextUpdaterFn = (id: string) => (old: Context) => {
  if (!old) return old;
  return {
    ancestors: old.ancestors.map(getUpdater(id)),
    descendants: old.descendants.map(getUpdater(id)),
  };
};

const getFavSearchUpdaterFn =
  (id: string) =>
  (old: { accounts: any[]; statuses: Status[]; hashtags: any[] }) => {
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
