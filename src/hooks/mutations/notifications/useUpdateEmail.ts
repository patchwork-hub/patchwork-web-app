import {
  emailNotifications,
} from "@/services/notifications/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: emailNotifications,
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["emailStatus"],
      });

      const previousEmailStatus = queryClient.getQueryData(["emailStatus"]);

      queryClient.setQueryData(["emailStatus"], (old: {data: boolean}) => ({
        ...old,
        data,
      }));

      return { previousEmailStatus };
    },
    onError: (err, data, context) => {
      queryClient.setQueryData(["emailStatus"], context?.previousEmailStatus);
    },
  });
};
