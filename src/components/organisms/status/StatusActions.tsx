import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { useBlockAccount } from "@/hooks/mutations/status/useBlockAccount";
import { useBookmarkStatus } from "@/hooks/mutations/status/useBookmarkStatus";
import { useBoostStatus } from "@/hooks/mutations/status/useBoostStatus";
import { useDeleteStatus } from "@/hooks/mutations/status/useDeleteStatus";
import { useFavouriteStatus } from "@/hooks/mutations/status/useFavouriteStatus";
import { useFollowAccount } from "@/hooks/mutations/status/useFollowAccount";
import { useMuteAccount } from "@/hooks/mutations/status/useMuteAccount";
import { useUnblockAccount } from "@/hooks/mutations/status/useUnblockAccount";
import { useUnbookmarkStatus } from "@/hooks/mutations/status/useUnbookmarkStatus";
import { useUnboostStatus } from "@/hooks/mutations/status/useUnboostStatus";
import { useUnfavouriteStatus } from "@/hooks/mutations/status/useUnfavouriteStatus";
import { useUnfollowAccount } from "@/hooks/mutations/status/useUnfollowAccount";
import { useUnmuteAccount } from "@/hooks/mutations/status/useUnmuteAccount";
import { useCheckAccountRelationship } from "@/hooks/queries/status/useCheckAccountRelationship";
import { useReportDialogStore } from "@/store/reportDialogStore";
import Cookies from "js-cookie";
import {
  Ban,
  Bookmark,
  Copy,
  Heart,
  Info,
  Languages,
  ListCheck,
  ListPlus,
  MessageCircle,
  MessageCircleOff,
  MoreHorizontal,
  Octagon,
  Repeat,
  Share2,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Account,
  AccountRelationship,
  Status as StatusType,
} from "../../../types/status";
import Status from "./Status";
import { formatNumber } from "@/utils/format-number";
import { useModalAction } from "../modal/modal.context";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import LoginDialog from "./LoginDialog";
import { cn } from "@/lib/utils";
import useLoggedIn from "@/lib/auth/useLoggedIn";

type StatusActionsProps = {
  status: StatusType;
  deleteId: string;
  editId: string;
  ownStatus?: boolean;
  showEdit?: boolean;
  handleTranslate?: () => void;
};

const FavouriteAction: React.FC<{
  status: StatusType;
  differentOrigin: boolean;
}> = ({ status, differentOrigin }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isLoggedIn = useLoggedIn();

  const favouriteMutation = useFavouriteStatus();
  const unfavouriteMutation = useUnfavouriteStatus();

  const handleFavourite = () => {
    const params = {
      id: status.id,
      differentOrigin,
      url: status.url,
    };
    if (status.favourited) {
      unfavouriteMutation.mutate(params);
    } else {
      favouriteMutation.mutate(params);
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginDialog
        status={status}
        actionType="favorite"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        action={
          <>
            <Heart className="w-4 h-4 text-[#96A6C2]" />
            <span className="text-[#96A6C2]">{status.favourites_count}</span>
          </>
        }
      />
    );
  }

  return (
    <button
      onClick={handleFavourite}
      className="flex items-center space-x-1 cursor-pointer"
    >
      <Heart
        className={`w-4 h-4 ${
          status.favourited ? "text-orange-500" : "text-[#96A6C2]"
        }`}
      />
      <span className="text-[#96A6C2]">
        {formatNumber(status.favourites_count)}
      </span>
    </button>
  );
};

const BoostAction: React.FC<{
  status: StatusType;
  differentOrigin: boolean;
}> = ({ status, differentOrigin }) => {
  const [showUnboostDialog, setShowUnboostDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const boostMutation = useBoostStatus();
  const unboostMutation = useUnboostStatus();

  const isLoggedIn = useLoggedIn();

  if (!isLoggedIn) {
    return (
      <LoginDialog
        status={status}
        actionType="boost"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        action={
          <>
            <Repeat className="w-4 h-4 text-[#96A6C2]" />
            <span className="text-[#96A6C2]">{status.reblogs_count}</span>
          </>
        }
      />
    );
  }

  const handleBoost = () => {
    if (status.reblogged) {
      setShowUnboostDialog(true);
    } else {
      handleBoostSubmit();
    }
  };

  const handleBoostSubmit = () => {
    boostMutation.mutate({
      id: status.id,
      visibility: status?.visibility,
      content: "",
      url: status.url,
      differentOrigin,
    });
  };

  const handleUnboostSubmit = () => {
    unboostMutation.mutate({
      id: status.id,
      url: status.url,
      differentOrigin,
    });
    setShowUnboostDialog(false);
  };

  return (
    <>
      <button
        onClick={handleBoost}
        className="flex items-center space-x-1 cursor-pointer"
      >
        <Repeat
          className={`w-4 h-4 ${
            status.reblogged ? "text-green-500" : "text-[#96A6C2]"
          }`}
        />
        <span className="text-[#96A6C2]">
          {formatNumber(status.reblogs_count)}
        </span>
      </button>
      <Dialog
        open={showUnboostDialog}
        onOpenChange={(isOpened) => {
          setShowUnboostDialog(isOpened);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Undo re-post?</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="p-4">
            <div className="max-h-[250px] sm:max-h-[360px] overflow-auto">
              <Status preview status={status.reblog ?? status} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowUnboostDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button className="" onClick={handleUnboostSubmit}>
                Undo re-post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const BookmarkAction: React.FC<{
  status: StatusType;
  differentOrigin: boolean;
}> = ({ status, differentOrigin }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const bookmarkMutation = useBookmarkStatus();
  const unbookmarkMutation = useUnbookmarkStatus();
  const isLoggedIn = useLoggedIn();

  if (!isLoggedIn) {
    return (
      <LoginDialog
        status={status}
        actionType="bookmark"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        action={
          <>
            <Bookmark className="w-4 h-4 text-[#96A6C2]" />
          </>
        }
      />
    );
  }

  const handleBookmark = () => {
    const params = {
      id: status.id,
      differentOrigin,
      url: status.url,
    };
    if (status.bookmarked) {
      unbookmarkMutation.mutate(params);
    } else {
      bookmarkMutation.mutate(params);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      className={cn("flex items-center space-x-1 cursor-pointer", {
        "cursor-auto": !isLoggedIn,
      })}
      // disabled={!isLoggedIn}
    >
      <Bookmark
        className={cn(
          "w-4 h-4",
          status.bookmarked ? "text-orange-500" : "text-[#96A6C2]"
          // {
          //   "text-gray-500": !isLoggedIn,
          // }
        )}
      />
    </button>
  );
};

const DeleteAction: React.FC<{ deleteId: string }> = ({ deleteId }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteStatus();

  const handleDelete = () => {
    deleteMutation.mutate({ id: deleteId, deleteMedia: true });
    setShowDeleteDialog(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center space-x-1 p-2 w-full rounded-lg text-orange-500 text-left  hover:bg-foreground/10"
      >
        <Trash2 className="w-4 h-4 text-orange-500" />
        <span>Delete</span>
      </button>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div>
            <p>Are you sure you want to delete this status?</p>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                className="mr-2"
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ReplyAction: React.FC<{
  status: StatusType;
  differentOrigin: boolean;
}> = ({ status, differentOrigin }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isLoggedIn = useLoggedIn();

  if (!isLoggedIn) {
    return (
      <LoginDialog
        status={status}
        actionType="reply"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        action={
          <>
            <MessageCircle className="w-4 h-4 text-[#96A6C2]" />
            <span className="text-[#96A6C2]">{status.replies_count}</span>
          </>
        }
      />
    );
  }

  return (
    <>
      <Link
        href={`/@${status.account.acct}/${status.id}`}
        className="flex items-center space-x-1"
      >
        <MessageCircle className="w-4 h-4 text-[#96A6C2]" />
        <span className="text-[#96A6C2]">{status.replies_count}</span>
      </Link>
    </>
  );
};

export const MuteAction: React.FC<{
  accountId?: string;
  status?: StatusType;
  relationship: AccountRelationship[];
}> = ({ accountId, status, relationship }) => {
  const [showMuteDialog, setShowMuteDialog] = useState(false);
  const muteMutation = useMuteAccount();
  const unmuteMutation = useUnmuteAccount();
  const { t } = useLocale();

  const handleMute = () => {
    if (relationship && relationship.length > 0 && relationship[0].muting) {
      unmuteMutation.mutate(
        accountId
          ? accountId
          : status.reblog
          ? status.reblog.account.id
          : status.account.id
      );
    } else {
      setShowMuteDialog(true);
    }
  };

  const handleMuteSubmit = () => {
    muteMutation.mutate({
      id: accountId
        ? accountId
        : status.reblog
        ? status.reblog.account.id
        : status.account.id,
    });
    setShowMuteDialog(false);
  };

  return (
    <>
      <button
        onClick={handleMute}
        className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
      >
        {relationship && relationship.length > 0 && relationship[0].muting ? (
          <MessageCircle className="w-4 h-4" />
        ) : (
          <MessageCircleOff className="w-4 h-4" />
        )}
        <span>
          {relationship && relationship.length > 0 && relationship[0].muting
            ? `${t("common.unmute")}`
            : `${t("timeline.mute")}`}
        </span>
      </button>
      <Dialog open={showMuteDialog} onOpenChange={setShowMuteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm_mute")}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div>
            <p>{t("sure_mute")}</p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMuteDialog(false)}
                className="mr-2"
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleMuteSubmit}>{t("timeline.mute")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const BlockAction: React.FC<{
  accountId: string;
  relationship: AccountRelationship[];
}> = ({ accountId, relationship }) => {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const blockMutation = useBlockAccount();
  const unblockMutation = useUnblockAccount();
  const { t } = useLocale();

  const handleBlock = () => {
    if (relationship && relationship.length > 0 && relationship[0].blocking) {
      unblockMutation.mutate(accountId);
    } else {
      setShowBlockDialog(true);
    }
  };

  const handleBlockSubmit = () => {
    blockMutation.mutate(accountId);
    setShowBlockDialog(false);
  };

  return (
    <>
      <button
        onClick={handleBlock}
        className="text-orange-500 flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10"
      >
        {relationship && relationship.length > 0 && relationship[0].blocking ? (
          <Octagon className="w-4 h-4" />
        ) : (
          <Ban className="w-4 h-4" />
        )}
        <span>
          {relationship && relationship.length > 0 && relationship[0].blocking
            ? `${t("common.unblock")}`
            : `${t("timeline.block")}`}
        </span>
      </button>
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm_block")}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div>
            <p>{t("sure_block")}</p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowBlockDialog(false)}
                className="mr-2"
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleBlockSubmit}>{t("timeline.block")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FollowAction: React.FC<{
  asButton?: boolean;
  accountId: string;
  relationship: AccountRelationship[];
}> = ({ accountId, relationship, asButton }) => {
  const followMutation = useFollowAccount();
  const unfollowMutation = useUnfollowAccount();

  const { t } = useLocale();
  const [openDialog, setOpenDialog] = useState(false);
  const isLoggedIn = useLoggedIn();

  const handleFollow = () => {
    if (
      relationship &&
      relationship.length > 0 &&
      (relationship[0].following || relationship[0].requested)
    ) {
      unfollowMutation.mutate(accountId);
    } else {
      followMutation.mutate(accountId);
    }
  };

  return asButton ? (
    <>
      <Button
        onClick={() => {
          if (isLoggedIn) {
            handleFollow();
          } else {
            setOpenDialog(true);
          }
        }}
        variant="outline"
        className="rounded-4xl border-[0.5px] border-[#96A6C2]"
      >
        {relationship && relationship.length > 0
          ? relationship[0].following || relationship[0].requested
            ? `${t("timeline.unfollow")}`
            : `${t("timeline.follow")}`
          : `${t("timeline.follow")}`}
      </Button>
      <LoginDialog
        actionType="login"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  ) : (
    <>
      <button
        onClick={() => {
          if (isLoggedIn) {
            handleFollow();
          } else {
            setOpenDialog(true);
          }
        }}
        className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
      >
        {relationship &&
        relationship.length > 0 &&
        (relationship[0].following || relationship[0].requested) ? (
          <ListCheck className="w-4 h-4" />
        ) : (
          <ListPlus className="w-4 h-4" />
        )}
        <span>
          {relationship && relationship.length > 0
            ? relationship[0].following || relationship[0].requested
              ? `${t("timeline.unfollow")}`
              : `${t("timeline.follow")}`
            : `${t("timeline.follow")}`}
        </span>
      </button>
      <LoginDialog
        actionType="login"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};

export const ReportAction: React.FC<{
  status?: StatusType;
  account?: Account;
}> = ({ status, account }) => {
  const openDialog = useReportDialogStore((state) => state.openDialog);
  const { t } = useLocale();
  return (
    <button
      onClick={() => openDialog({ status, account })}
      className="text-orange-500 flex items-center gap-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10"
    >
      <Info className="w-4 h-4" />
      <span>{t("timeline.report")}</span>
    </button>
  );
};

const CopyLinkAction: React.FC<{ status: StatusType }> = ({ status }) => {
  const { t } = useLocale();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(status.url);
    toast.success(t("toast.link_copied"));
  };

  return (
    <button
      onClick={handleCopyLink}
      className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
    >
      <Copy className="w-4 h-4" />
      <span>{t("timeline.copy_link")}</span>
    </button>
  );
};

const ShareViaAction: React.FC<{ status: StatusType }> = ({ status }) => {
  const { t } = useLocale();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          url: status.url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
    >
      <Share2 className="w-4 h-4" />
      <span>{t("timeline.share_via")}</span>
    </button>
  );
};

const TranslateAction = ({ handleTranslate }) => {
  const { t } = useLocale();
  const translateStatus = async () => {
    handleTranslate();
  };

  return (
    <button
      onClick={translateStatus}
      className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
    >
      <Languages className="w-4 h-4" />
      <span>{t("timeline.translate")}</span>
    </button>
  );
};

export const StatusActions: React.FC<StatusActionsProps> = ({
  status,
  deleteId,
  editId,
  ownStatus,
  showEdit,
  handleTranslate,
}) => {
  const router = useRouter();
  const { openModal } = useModalAction();
  const [showOptions, setShowOptions] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isLoggedIn = useLoggedIn();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data: relationship } = useCheckAccountRelationship({
    id: status.reblog ? status.reblog.account.id : status.account.id,
    enabled: showOptions && !ownStatus,
  });

  const handleEdit = async () => {
    await Cookies.set("statusId", editId);
    // router.push(`/edit-status`);
    openModal("EDIT_COMPOSE_FORM_VIEW");
    setShowOptions(false);
    setIsPopoverOpen(false);
  };

  const differentOrigin =
    status.account.acct.includes("@") &&
    !status.account.acct.includes("@" + Cookies.get("domain"));

  return (
    <div className="flex items-center justify-between">
      <ReplyAction status={status} differentOrigin={differentOrigin} />
      <FavouriteAction status={status} differentOrigin={differentOrigin} />
      <BoostAction status={status} differentOrigin={differentOrigin} />
      <BookmarkAction status={status} differentOrigin={differentOrigin} />
      <div className="relative">
        {isLoggedIn ? (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={() => setShowOptions((prev) => !prev)}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4 text-[#96A6C2]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <CopyLinkAction status={status} />
              <ShareViaAction status={status} />
              <TranslateAction
                handleTranslate={() => {
                  handleTranslate(), setIsPopoverOpen(false);
                }}
              />
              {ownStatus ? (
                <>
                  {showEdit && (
                    <button
                      onClick={handleEdit}
                      className="text-foreground flex items-center space-x-1 p-2 w-full rounded-lg text-left hover:bg-foreground/10 cursor-pointer"
                    >
                      <SquarePen className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  <DeleteAction deleteId={deleteId} />
                </>
              ) : (
                <>
                  <FollowAction
                    accountId={
                      status.reblog
                        ? status.reblog.account.id
                        : status.account.id
                    }
                    relationship={relationship}
                  />
                  <MuteAction status={status} relationship={relationship} />
                  <BlockAction
                    accountId={
                      status.reblog
                        ? status.reblog.account.id
                        : status.account.id
                    }
                    relationship={relationship}
                  />
                  <ReportAction status={status} />
                </>
              )}
            </PopoverContent>
          </Popover>
        ) : (
          <LoginDialog
            status={status}
            actionType="menu"
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            action={
              <>
                <MoreHorizontal className="w-4 h-4 text-[#96A6C2]" />
              </>
            }
          />
        )}
      </div>
    </div>
  );
};
