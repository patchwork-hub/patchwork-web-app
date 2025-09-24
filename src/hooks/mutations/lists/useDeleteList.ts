import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ListsQueryKey } from "@/types/queries/lists.type";
import { deleteList } from "@/services/list/deleteList";

type ListItem = {
  id: number | string;
  title: string;
};

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();
  const queryKey: ListsQueryKey = ["lists"];
  return useMutation({
    mutationFn: deleteList,
    onMutate: async (listId: number | string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLists =
        queryClient.getQueryData<ListItem[]>(["lists"]) || [];

      queryClient.setQueryData<ListItem[]>(["lists"], (old) =>
        old?.filter((list) => list.id !== listId)
      );

      return { previousLists };
    },
    onError: (err, listId, context) => {
      queryClient.setQueryData(["lists"], context?.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
};
