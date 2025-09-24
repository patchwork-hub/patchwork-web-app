import { toggleHashtagFollow } from "@/services/hashtag/toggleHashtagFollow";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HashtagDetail {
  id: string;
  name: string;
  url: string;
  history: any[];
  following: boolean;
}

export const useToggleHashtagFollow = ({
  domain_name,
  hashtag,
}: {
  domain_name: string;
  hashtag: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shouldFollow }: { shouldFollow: boolean }) =>
      toggleHashtagFollow({
        hashtag,
        shouldFollow,
      }),
    onMutate: async ({ shouldFollow }) => {
      const queryKey = ["hashtag-detail", { domain_name, hashtag }];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<HashtagDetail>(queryKey);

      queryClient.setQueryData<HashtagDetail>(queryKey, (old) => {
        return old ? { ...old, following: shouldFollow } : old;
      });

      return { previousData };
    },
    onSuccess: (data: HashtagDetail) => {
      const queryKey = ["hashtag-detail", { domain_name, hashtag }];
      queryClient.setQueryData(queryKey, data);
    },
    onSettled: () => {
      const queryKey = ["hashtag-detail", { domain_name, hashtag }];
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err, variables, context) => {
      const queryKey = ["hashtag-detail", { domain_name, hashtag }];
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
};
