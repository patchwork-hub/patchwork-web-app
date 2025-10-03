"use client";

import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import { useCustomEmojiStore } from "@/components/organisms/compose/store/useCustomEmojiStore";
import { useMarkConversationAsRead } from "@/hooks/mutations/conversations/useMarkConversationAsRead";
import { useRemoveConversation } from "@/hooks/mutations/conversations/useRemoveConversation";
import { useNotificationRequests } from "@/hooks/queries/conversations/useGetNotificationRequests";
import { useViewAllConversations } from "@/hooks/queries/conversations/useViewAllConversations";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn, getExactUsername, getRawText } from "@/lib/utils";
import { Conversation } from "@/types/conversation";
import { isSystemDark } from "@/utils/helper/helper";
import TimeAgo from "@/utils/helper/timeAgo";
import { useQueryClient } from "@tanstack/react-query";
import { Dot, MessageSquareWarning, MoreVertical, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/providers/localeProvider";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import { Account } from "@/types/account";
import { useConversationStore } from "@/stores/conversations/conversation";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import Image from "next/image";

const ConversationsPage: React.FC = () => {
  const { data: notificationRequests } = useNotificationRequests();
  const {t} = useLocale();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useViewAllConversations();

  const queryClient = useQueryClient();
  const { message, setMessage } = useFCMStore();

  useEffect(() => {
    if (message) {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    }
  }, [message]);

  const { data: currentUser, isLoading: isLoadingCredentials } =
    useVerifyAuthToken({
      enabled: true,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 0);
    }
  }, []);

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return (
    <div className="mx-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-foreground my-2">{t("screen.conversations")}</h1>
        <div className="flex space-x-2">
          <Link
            href="/conversations/requests"
            className="text-foreground border border-gray-200 rounded-md px-2 py-2 shadow-md transition-colors relative"
          >
            <MessageSquareWarning className="w-5 h-5" />
            {notificationRequests && notificationRequests?.length > 0 && (
              <span className="absolute top-2 right-0 w-2 h-2 bg-orange-500 rounded-full translate-x-1/2 -translate-y-1/2"></span>
            )}
          </Link>
          <Link
            href="/conversations/new"
            className="bg-orange-900 text-[#fff] rounded-md px-2 py-2 shadow-lg hover:bg-orange-900/70 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </div>
      {isLoadingEmojis || isLoading || isLoadingCredentials ? (
        <ul className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <ConversationSkeleton key={index} />
          ))}
        </ul>
      ) : (
        <ul>
          {data && data?.pages[0].conversations.length > 0 ? (
            data?.pages.map((page) =>
              page.conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  currentUser={currentUser as Account}
                />
              ))
            )
          ) : (
            <div className="p-4 flex justify-center items-center">
              <p>{t("common.no_conversation_found")}</p>
            </div>
          )}
        </ul>
      )}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && (
        <div className="p-4">
          <ConversationSkeleton />
        </div>
      )}
    </div>
  );
};

const ConversationListItem: React.FC<{
  conversation: Conversation;
  currentUser: Account;
}> = ({ conversation, currentUser }) => {
  const setConversation = useConversationStore(
    (state) => state.setConversation
  );
  const {t} = useLocale();
  const { mutate: removeConversation } = useRemoveConversation();
  const { mutate: markConversationAsRead } = useMarkConversationAsRead();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();
  const account = conversation.accounts.length > 0 && conversation.accounts[0];
  
  const { editorjsx } = useTipTapEditor({
    editable: false,
    className: "",
    content: conversation?.accounts
      ?.map((it) => it.display_name || it.username)
      ?.join(", "),
    emojis: conversation?.accounts?.map((it) => it.emojis).flat() as MastodonCustomEmoji[],
  });

  const { editorjsx: lastMessage } = useTipTapEditor({
    editable: false,
    className: "line-clamp-1",
    content: getRawText(conversation?.last_status?.content ?? "")
      .replace(`@${account ? account?.acct : ''}`, "")
      .replace(currentUser ? (getExactUsername(currentUser.url) || "") : "", ""),
  });

  if (!account) {
    return null;
  }

   const handleDelete = () => {
    removeConversation(conversation.id);
    setIsDialogOpen(false);
    setIsPopoverOpen(false);
  };

  const handleMarkAsRead = () => {
    markConversationAsRead(conversation.id);
    setIsPopoverOpen(false);
  };


  return conversation && conversation.accounts.length > 0 ? (
    <li
      onClick={() => {
        setConversation(conversation);
      }}
      className="relative group"
    >
      <Link
        className="flex gap-5 items-center rounded-md p-[10px] hover:bg-white/12"
        href="/conversations/chat"
      >
        {conversation.accounts.length > 1 ? (
          <div className="w-12 h-12 aspect-square relative">
            {conversation.accounts
              .map((it) => it.avatar)
              .map((avatar, index) => (
                <Image
                  key={index}
                  className={cn(
                    "w-9 h-9 aspect-square rounded-full absolute bg-[#96a6c2] border border-white",
                    {
                      "top-0 end-0 z-10": index === 0,
                      "bottom-0 start-0": index !== 0,
                    }
                  )}
                  width={36}
                  height={36}
                  src={avatar}
                  alt={avatar + index}
                />
              ))}
          </div>
        ) : (
          <div className="w-12 h-12 aspect-square">
            <Image
              className="w-12 h-12 aspect-square rounded-2xl bg-[#96a6c2]"
              src={account.avatar}
              alt="avatar"
            />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <h2
            className={cn("text-[15px]", {
              "text-white": conversation.unread,
              "text-white/60": !conversation.unread,
            })}
          >
            {editorjsx}
          </h2>
          <h3 className="text-foreground/60 text-[14px]">{account.acct}</h3>
          <div className="flex gap-1 items-center">
            <div
              className={cn("text-[13px] line-clamp-1", {
                "text-white": conversation.unread,
                "text-white/50": !conversation.unread,
              })}
            >
              {lastMessage}
            </div>
            <Dot size={10} className="text-foreground/50 min-w-[10px]" />
            {conversation.last_status && (
              <TimeAgo
                className="text-[13px] text-foreground/50 whitespace-nowrap"
                timestamp={conversation.last_status?.created_at}
              />
            )}
            {conversation.unread && (
              <span className="w-2 h-2 aspect-square rounded-full bg-orange-500 ml-2" />
            )}
          </div>
        </div>
      </Link>

      {/* Option Button with Popover */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background">
              <MoreVertical size={16} className="text-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-fit border-none",
              theme === "dark" || (theme === "system" && isSystemDark)
                ? "text-white"
                : "text-black bg-white"
            )}
          >
            <div className="flex flex-col gap-2">
              {conversation.unread && (
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={handleMarkAsRead}
                >
                  Mark as read
                </Button>
              )}
              <button
                className="justify-start text-sm text-orange-500 hover:text-orange-500/90 cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                {t("screen.delete_conversation")}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  ) : null;
};

const ConversationSkeleton: React.FC = () => {
  return (
    <li className="flex gap-5 items-center rounded-md p-[10px]">
      <div className="w-12 h-12 rounded-2xl bg-white/10 animate-pulse" />
      <div className="flex flex-col flex-1 space-y-2">
        <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse" />
        <div className="flex items-center gap-1">
          <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-2 bg-white/10 rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </li>
  );
};

export default ConversationsPage;
