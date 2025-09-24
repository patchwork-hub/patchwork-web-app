import {
  useMutation,
  useQueryClient,
  QueryClient
} from "@tanstack/react-query";
import { AccountRelationship } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { unmuteAccount } from "@/services/status/account";
import { AxiosError } from "axios";

export const useUnmuteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AccountRelationship,
    AxiosError<ErrorResponse>,
    Parameters<typeof unmuteAccount>[0]
  >({
    mutationFn: unmuteAccount,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["accountRelationship", id]
      });

      const previousData: ReturnType<QueryClient["getQueryData"]> =
        queryClient.getQueryData(["accountRelationship", id]);

      queryClient.setQueryData(["accountRelationship", id], unmuteUpdaterFn);

      return previousData;
    },
    onError: (err, id, snapshot: ReturnType<QueryClient["getQueryData"]>) => {
      if (snapshot) {
        queryClient.setQueryData(["accountRelationship", id], snapshot);
      }
    }
  });
};

const unmuteUpdaterFn = (old: AccountRelationship[]): AccountRelationship[] => {
  if (!old) return old;
  return old.map((it) => ({ ...it, muting: false }));
};
