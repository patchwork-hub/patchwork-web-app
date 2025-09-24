import { listsService } from "@/services/home-feed/listService";
import { ListsQueryKey } from "@/types/queries/lists.type";
import { useQuery } from "@tanstack/react-query";

export const listsQueryKey: ListsQueryKey = ["lists"];
export const useListsQueries = () => {
  return useQuery({
    queryKey: listsQueryKey,
    queryFn: listsService,
    staleTime: 1000 * 60 * 3,
  });
};
