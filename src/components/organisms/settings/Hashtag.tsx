import { queryClient } from "@/providers/queryProvider";
import { useRemoveOrUpdateHashtag } from "@/hooks/mutations/profile/useChannelContent";
import { useState } from "react";
import { toast } from "sonner";
import HashtagDeleteDialog from "./HashtagDeleteDialog";
import SearchHashtagModal from "./SearchHashtagDialog";
import { ChannelHashtag } from "@/types/patchwork";

type Props = {
  hashtag: ChannelHashtag;
  channelId: string;
  isLastOne: boolean;
};

const HashtagItem = ({ hashtag, channelId }: Props) => {
  const [isEditModal, setEditModal] = useState(false);
  const [alertState, setAlert] = useState({
    message: "",
    isOpen: false,
    showCancel: true,
  });

  const { mutate } = useRemoveOrUpdateHashtag({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-hashtag-list", { channelId }],
      });
      setAlert({
        message: "",
        isOpen: false,
        showCancel: false,
      });
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });


  const handleDeleteIcon = () => {
    mutate({
      hashtag: hashtag.name,
      channelId,
      hashtagId: hashtag.id.toString(),
      operation: "delete",
    });
  };

  return (
    <div className="py-2 px-2 rounded-md bg-patchwork-dark-50 flex justify-between">
      <p>
        {hashtag?.name}
      </p>
      <SearchHashtagModal
        isOpen={isEditModal}
        onClose={() => setEditModal(false)}
        editModalState={{ item: hashtag }}
        channelId={channelId}
      />

      <HashtagDeleteDialog
        isOpen={alertState.isOpen}
        onOpenChange={() => setAlert({ ...alertState, isOpen: false })}
        message={alertState.message}
        onDelete={handleDeleteIcon}
      />
    </div>
  );
};

export default HashtagItem;
