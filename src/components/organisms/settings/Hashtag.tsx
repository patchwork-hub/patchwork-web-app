import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useRemoveOrUpdateHashtag } from "@/hooks/mutations/profile/useChannelContent";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import HashtagDeleteDialog from "./HashtagDeleteDialog";
import SearchHashtagModal from "./SearchHashtagDialog";

type Props = {
  hashtag: ChannelHashtag;
  channelId: string;
  isLastOne: boolean;
};

const HashtagItem = ({ hashtag, channelId, isLastOne }: Props) => {
  const [isEditModal, setEditModal] = useState(false);
  const [alertState, setAlert] = useState({
    message: "",
    isOpen: false,
    showCancel: true,
  });

  const { mutate, isPending } = useRemoveOrUpdateHashtag({
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

  const handleEditIconClick = () => {
    setEditModal(true);
  };

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
        {/* # {truncateStr(removeHashtagSign(hashtag?.name), 30)} */}#
        {hashtag?.name}
      </p>
      {/* <div className="flex items-center">
        <div
          className="bg-orange-500 rounded-full p-1 mr-1 active:opacity-80"
          onClick={handleEditIconClick}
        >
          <PenIcon width={14} height={14} className="m-[2]" />
        </div>
        <div
          className="bg-orange-500 rounded-full p-1 mr-1 active:opacity-80"
          onClick={() => {
            setAlert({
              isOpen: true,
              message: isLastOne
                ? "At least one hashtag is required"
                : `Are you sure you want to delete this keyword '${hashtag.name}'`,
              showCancel: isLastOne ? false : true
            });
          }}
        >
          <TrashIcon width={14} height={14} fill={"#fff"} className="m-[2]" />
        </div>
      </div> */}
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
