import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editList } from "@/services/list/editList";
import { CreateListResponse } from "@/types/queries/lists.type";
type TListedit = {
  payload: CreateListResponse;
  id: string | number;
};

export const useEditListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, id }: TListedit) => editList(payload, id),
    onMutate: async (newList) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (error) => {
      console.error("Error creating list:", error);
    },
  });
};
