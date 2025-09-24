import { ThemeText } from "@/components/atoms/common/ThemeText";
import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useUserRelationshipMutation } from "@/hooks/mutations/profile/useCheckRelationship";
import { useMuteUnmuteUserMutation } from "@/hooks/mutations/profile/useMuteUnmuteUser";
import { truncateUsername } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ContributorProfileProps {
  account: ContributorList;
  channelId: string;
  operationType: "follow" | "mute";
  className?: string;
}
const ContributorProfile: React.FC<ContributorProfileProps> = ({
  account,
  channelId,
  operationType,
}) => {
  const [alertState, setAlert] = useState({
    message: "",
    isOpen: false,
  });
  const { mutate: mutateUserFollow } = useUserRelationshipMutation({
    onMutate: ({ accountId }) => {
      const queryKey = ["contributor-list", { channelId }];
      const previousData =
        queryClient.getQueryData<ContributorList[]>(queryKey);
      if (previousData) {
        const updatedData: ContributorList[] = previousData.filter(
          (item) => item.id !== accountId
        );
        queryClient.setQueryData(queryKey, updatedData);
      }
    },
    onSuccess: (newRelationship) => {},
    onError: (err) => {
      toast.error(err?.message || "Something went wrong!");
    },
  });

  const { mutate: toggleMute, isPending: isMuteInProgress } =
    useMuteUnmuteUserMutation({
      onMutate: ({ accountId }) => {
        const queryKey = ["muted-contributor-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ContributorList[]>(queryKey);
        if (previousData) {
          const updatedData: ContributorList[] = previousData.filter(
            (item) => item.id !== accountId
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      },
      onSuccess: (response) => {},
    });

  const handleUnFollow = (id: string) => {
    mutateUserFollow({
      accountId: id,
      isFollowing: true,
    });
  };

  const handleMute = (id: string, isMuted: boolean) => {
    toggleMute({ accountId: id, toMute: !isMuted });
  };

  return (
    <Dialog open={alertState.isOpen}>
      <div className="flex flex-col justify-center items-center">
        <Link
          target="_blank"
          href={`${account?.attributes?.profile_url}`}
          className="flex flex-col justify-center items-center"
        >
          <div className="bg-black border border-slate-200 items-start rounded-full w-[80px] h-[80px]">
            <Image
              src={account?.attributes?.avatar_url}
              className="rounded-full bg-slate-200 w-[80px] h-[80px]"
              alt={account?.attributes?.username}
              width={80}
              height={80}
            />
          </div>
          <ThemeText className="font-semibold mt-2">
            {truncateUsername(account?.attributes?.username)}
            {/* {account.attributes.username} */}
          </ThemeText>
          <ThemeText variant="textGrey" size="fs_13">
            @{truncateUsername(account?.attributes?.username)}
            {/* @{account.attributes.username} */}
          </ThemeText>
        </Link>
        <button
          onClick={() => {
            setAlert({
              isOpen: true,
              message: `Are you sure you want to remove this contributor ${account?.attributes?.username}`,
            });
          }}
          className="active:opacity-80"
        >
          <ThemeText className="mt-1" variant="textRedUnderline">
            Remove
          </ThemeText>
        </button>
      </div>
      <DialogContent isCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to remove this contributor '
          {account?.attributes?.username}'
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
              operationType == "follow"
                ? handleUnFollow(account.attributes.id)
                : handleMute(
                    account.attributes.id,
                    account.attributes.is_muted
                  );
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributorProfile;
