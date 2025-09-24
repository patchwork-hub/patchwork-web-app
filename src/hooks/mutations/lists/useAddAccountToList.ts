import {
  addAccountToList,
  removeAccountfromList,
} from "@/services/list/addAccountToList";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddAccountToList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAccountToList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts-in-list"] });
    },
    onError: (error) => {
      console.error("Error adding account to list:", error);
    },
  });
};

export const useRemoveAccountFromList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAccountfromList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts-in-list"] });
    },
    onError: (error) => {
      console.error("Error adding account to list:", error);
    },
  });
};
