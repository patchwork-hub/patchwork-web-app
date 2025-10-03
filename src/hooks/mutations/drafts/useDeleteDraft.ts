import { deleteDraft } from "@/services/draft/draft";
import { DraftStatusesResponse } from "@/types/draft";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDraft,
    onMutate: async (draftId) => {
      const previousDrafts = queryClient.getQueryData(["statusDrafts"]);
      queryClient.setQueryData(
        ["statusDrafts"],
        (old: DraftStatusesResponse): DraftStatusesResponse => {
          if (!old) return old;
          return old.map((it) => ({
            ...it,
            datas: it.datas.filter((draft) => draft.id !== draftId),
          }));
        }
      );
      return { previousDrafts };
    },
    onError: (err, draftId, context) => {
      queryClient.setQueryData(["statusDrafts"], context?.previousDrafts);
    },
  });
};
