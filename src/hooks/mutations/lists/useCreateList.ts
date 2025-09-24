import { createList } from "@/services/list/createList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onMutate: async (newList) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (error) => {
      console.error("Error creating list:", error);
    },
  });
};
