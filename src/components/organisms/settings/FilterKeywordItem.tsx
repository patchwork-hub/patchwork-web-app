import { useState } from "react";
import { toast } from "sonner";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useRemoveOrUpdateFilterKeyword } from "@/hooks/mutations/profile/useChannelContent";
import { cn } from "@/lib/utils";
import { Check, PenIcon, TrashIcon, X } from "lucide-react";
import AddFilterKeywordModal from "./FilterInKeywordDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import FilterOutKeywordModal from "./FilterOutKeywordDialog";

type Props = {
  keyword: ChannelFilterKeyword;
  channelId: string;
  itemType: "filter-in" | "filter-out";
};
export const FilterKeywordItem = ({ keyword, channelId, itemType }: Props) => {
  const [isEditModal, setEditModal] = useState(false);
  const [alertState, setAlert] = useState({
    message: "",
    isOpen: false,
  });
  const { mutate, isPending } = useRemoveOrUpdateFilterKeyword({
    onMutate(variables) {
      if (itemType == "filter-in") {
        const queryKey = ["channel-filter-keyword-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ChannelFilterKeyword[]>(queryKey);
        if (previousData) {
          const updatedData: ChannelFilterKeyword[] = previousData.filter(
            (item) => item.id.toString() !== variables.keywordId
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      } else {
        const queryKey = ["channel-filter-out-keyword-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ChannelFilterKeyword[]>(queryKey);
        if (previousData) {
          const updatedData: ChannelFilterKeyword[] = previousData.filter(
            (item) => item.id.toString() !== variables.keywordId
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      }
      // itemType == "filter-in"
      //   ? removeFilterKeyword(channelId, variables.keywordId)
      //   : removeFilterOutKeyword(channelId, variables.keywordId);
    },
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  const handleEditIconClick = () => {
    setEditModal(true);
  };

  const handleDeleteIconClick = () => {
    mutate({
      keyword: keyword.keyword,
      channelId,
      keywordId: keyword.id.toString(),
      operation: "delete",
      filter_type: "filter_in",
      is_filter_hashtag: false,
    });
  };

  return (
    <Dialog
      open={alertState.isOpen}
      onOpenChange={() => {
        setAlert({
          isOpen: false,
          message: "",
        });
      }}
    >
      <div className="py-2 px-2 rounded-md bg-patchwork-dark-50 flex items-center justify-evenly">
        <div className="flex-1">{keyword.keyword}</div>
        <div
          className={cn(
            itemType == "filter-out" ? "flex flex-1 flex-row justify-end" : ""
          )}
        >
          {itemType == "filter-out" && (
            <p className="flex-1">
              {keyword.is_filter_hashtag ? (
                <Check
                  strokeWidth={1.75}
                  size={20}
                  className="text-green-500"
                />
              ) : (
                <X strokeWidth={1.75} size={20} className="text-orange-500" />
              )}
            </p>
          )}
          <div
            className={cn(
              "flex items-center",
              itemType == "filter-out" && "flex-1 justify-end"
            )}
          >
            <div
              className="bg-orange-500 rounded-full p-1 mr-1 active:opacity-80 "
              onClick={handleEditIconClick}
            >
              <PenIcon width={14} height={14} className="m-[2]" />
            </div>
            <div
              className="bg-orange-500 rounded-full p-1 mr-1 active:opacity-80 "
              onClick={() => {
                setAlert({
                  isOpen: true,
                  message: `Are you sure you want to delete this keyword '${keyword.keyword}'`,
                });
              }}
            >
              <TrashIcon
                width={14}
                height={14}
                fill={"#fff"}
                className="m-[2]"
              />
            </div>
          </div>
        </div>

        {isEditModal && itemType == "filter-in" && (
          <AddFilterKeywordModal
            isOpen={isEditModal}
            onClose={() => setEditModal(false)}
            editModalState={{ item: keyword }}
            channelId={channelId}
          />
        )}

        {isEditModal && itemType == "filter-out" && (
          <FilterOutKeywordModal
            isOpen={isEditModal}
            onClose={() => setEditModal(false)}
            editModalState={{ item: keyword }}
            channelId={channelId}
          />
        )}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to remove this contributor '{keyword.keyword}'
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAlert({ isOpen: false, message: "" })}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setAlert({ isOpen: false, message: "" });
              handleDeleteIconClick();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default FilterKeywordItem;
