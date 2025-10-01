"use client";

import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import MessageInput from "@/components/organisms/compose/MessageInput";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import { StatusComposeFormData } from "@/components/organisms/compose/types";
import MediaAttachmentPreview from "@/components/organisms/status/MediaAttachmentPreview";
import { useMarkConversationAsRead } from "@/hooks/mutations/conversations/useMarkConversationAsRead";
import { useCreateStatus } from "@/hooks/mutations/status/useCreateStatus";
import { useUploadMedia } from "@/hooks/mutations/status/useUploadMedia";
import { useGetContext } from "@/hooks/queries/status/useGetContext";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn, getExactUsername, getRawText } from "@/lib/utils";
import { fetchFile } from "@/services/media/fetchMediaFiles";
import { Media, Mention, Status } from "@/types/status";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import { useLocale } from "@/providers/localeProvider";
import { useConversationStore } from "@/stores/conversations/conversation";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { DisplayName } from "@/components/molecules/common/DisplayName";
import Image from "next/image";

const ConversationPage = () => {
  const queryClient = useQueryClient();
  const { message } = useFCMStore();
  
  useEffect(() => {
    if (message) {
      queryClient.invalidateQueries({
        queryKey: ["context"],
      });
    }
  }, [message, queryClient]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const [messageHistory, setMessagesHistory] = useState<Status[]>([]);

  const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia();
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);

  const { mutateAsync: sendMessage, isPending: isSending } = useCreateStatus();

  const { mutate: markConversationAsRead } = useMarkConversationAsRead();
  const { conversation, setConversation } = useConversationStore();

  const handleMarkConversationAsRead = useCallback(() => {
    if (conversation && conversation.unread) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation, markConversationAsRead]);

  useEffect(() => {
    handleMarkConversationAsRead();
  }, [handleMarkConversationAsRead]);

  const accounts = conversation?.accounts ?? [];
  const isGroupChat = accounts.length > 1;

  const { data: currentUser, isLoading: isFetchingCurrentUser } =
    useVerifyAuthToken({ enabled: true });
  const currentUsername = currentUser ? getExactUsername(currentUser.url) : "";

  const { data: contextData } = useGetContext(conversation?.last_status?.id ?? "");

  useEffect(() => {
    if (contextData && conversation?.last_status) {
      setMessagesHistory([
        ...contextData?.ancestors,
        conversation?.last_status,
        ...contextData?.descendants,
      ]);
      
    
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0);
    }
  }, [contextData, conversation?.last_status, message]);

  const removeMentions = (
    content: string,
    mentions: Mention[],
    currentUsername: string
  ) => {
    let cleanedText = getRawText(content);

    cleanedText = cleanedText.replace(/@\w+@[\w.-]+/g, "");

    cleanedText = cleanedText.replace(/@\w+/g, "");

    cleanedText = cleanedText.replace(currentUsername, "");

    return cleanedText.trim();
  };

  const handleUploads = async (files: File[]) => {
    const mediaFiles = Array.from(files);
    const media = await Promise.all(
      mediaFiles.map(async (file) => {
        return await uploadMedia({ file, description: "" });
      })
    );
    setUploadedMedias([...uploadedMedias, ...media]);
  };

  const [isLoadingGifv, setIsLoadingGifv] = useState(false);
  const handleGifvSelect = async (url: string) => {
    setIsLoadingGifv(true);
    const file = await fetchFile(url);
    setIsLoadingGifv(false);
    const media = await uploadMedia({ file, description: "" });
    setUploadedMedias((prev) => [...prev, media]);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!conversation) return;

    const formData: StatusComposeFormData = {
      status:
        accounts.map((account) => `@${account.acct}`).join(" ") +
        " " +
        messageContent,
      visibility: "direct",
      media_ids: uploadedMedias.map((media) => media.id),
      language: "en",
      in_reply_to_id:
        messageHistory.length > 0
          ? messageHistory[messageHistory.length - 1].id
          : conversation?.last_status?.id,
    };

    const newStatus = await sendMessage({ formData });
    setMessagesHistory((prev) => [...prev, newStatus]);
    setConversation({ ...conversation, last_status: newStatus });
    setUploadedMedias([]);
  };

  const removeMedia = (mediaId: string) => {
    setUploadedMedias(uploadedMedias.filter((media) => media.id !== mediaId));
  };

  if (!conversation || isFetchingCurrentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-73px)] sm:min-h-dvh text-white">
      <div className="flex items-center p-4 border-b-[0.5px] border-gray-600">
        <Link href="/conversations" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10">
            {isGroupChat ? (
              <div className="w-10 h-10 aspect-square relative">
                {accounts?.slice(0, 2)?.map((account) => (
                  <Image
                    key={account.id}
                    className={cn(
                      "w-8 aspect-square rounded-full absolute bg-gray-300 border border-white",
                      {
                        "top-0 end-0 z-10": account === accounts[0],
                        "bottom-0 start-0": account !== accounts[0],
                      }
                    )}
                    width={32}
                    height={32}
                    src={account.avatar}
                    alt={account.display_name}
                  />
                ))}
              </div>
            ) : (
              accounts &&
              accounts.length > 0 && (
                <Image
                  alt={accounts[0].display_name || accounts[0].username}
                  width={40}
                  height={40}
                  className="min-w-10 aspect-square rounded-2xl"
                  src={accounts[0].avatar}
                />
              )
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-1 text-foreground">
              {isGroupChat ? (
                accounts
                  .map((account) => (
                    <DisplayName
                      emojis={account.emojis as MastodonCustomEmoji[]}
                      key={account.id}
                      acct={account.acct}
                      displayName={account.display_name || account.username}
                    />
                  ))
                  .reduce<React.ReactNode[]>(
                    (prev, curr, index) =>
                      index === 0 ? [curr] : [...prev, ", ", curr],
                    []
                  )
              ) : (
                <DisplayName
                  emojis={accounts[0]?.emojis as MastodonCustomEmoji[]}
                  acct={accounts[0]?.acct}
                  displayName={accounts[0]?.display_name || accounts[0]?.username}
                />
              )}
            </h1>
            {!isGroupChat && accounts && accounts.length > 0 && (
              <p className="text-sm text-gray-400">
                <Link href={`/@${accounts[0].acct}`}>
                  {getExactUsername(accounts[0].url) ||
                    (accounts[0].acct.startsWith("@")
                      ? accounts[0].acct
                      : `@${accounts[0].acct}`)}
                </Link>{" "}
                • Joined on {dayjs(accounts[0].created_at).format("MMMM YYYY")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gray-900 text-center p-3 rounded-lg mb-8">
          <p className="text-sm font-semibold">{t("conversation.not_end_to_end_encrypted")}</p>
          <p className="text-xs text-[#fff]">
            {t("conversation.unencrypted_detail")}
          </p>
        </div>

        <div className="space-y-4">
          {messageHistory.map((message, idx, arr) => {
            const username = message.account?.username;
            const nextUsername =
              arr.length - 1 === idx ? null : arr[idx + 1].account?.username;
            return (
              currentUser && (
                <div
                  ref={idx === arr.length - 1 ? messagesEndRef : null}
                  key={message.id}
                  className={`flex ${
                    currentUser?.username === message.account?.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <MessageBubble
                    emojis={message.account?.emojis as MastodonCustomEmoji[]}
                    showAvatar={username !== nextUsername}
                    message={message}
                    isCurrentUser={
                      currentUser?.username === message.account?.username
                    }
                    removeMentions={removeMentions}
                    currentUsername={currentUsername as string}
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
      <MessageInput
        className="p-4 border-t-[0.5px] border-gray-600"
        isLoadingGifv={isLoadingGifv}
        isUploading={isUploading}
        isSending={isSending}
        onSendMessage={handleSendMessage}
        onUploadMedia={handleUploads}
        uploadedMedias={uploadedMedias}
        onRemoveMedia={removeMedia}
        onGifvSelect={handleGifvSelect}
        placeholder={t("conversation.your_message") as string}
      />
    </div>
  );
};

const formatTimestamp = (timestamp: string) => {
  const messageDate = dayjs(timestamp);
  const today = dayjs();

  if (messageDate.isSame(today, "day")) {
    return messageDate.format("h:mm A");
  }

  return messageDate.format("MMMM D, YYYY h:mm A");
};

const MessageBubble: React.FC<{
  emojis?: MastodonCustomEmoji[];
  showAvatar?: boolean;
  message: Status;
  isCurrentUser: boolean;
  removeMentions: (
    content: string,
    mentions: Mention[],
    currentUsername: string
  ) => string;
  currentUsername: string;
}> = ({
  message,
  isCurrentUser,
  removeMentions,
  currentUsername,
  showAvatar,
  emojis,
}) => {
  const content = removeMentions(
    message.content,
    message.mentions,
    currentUsername
  );

  const { editorjsx } = useTipTapEditor({
    editable: false,
    emojis,
    content,
    contentClassName: "text-[#fff]",
  });

  return (
    <div className="flex gap-3 items-end">
      {!isCurrentUser &&
        (showAvatar ? (
          <Link href={`/@${message.account?.acct}`}>
            <Image
              alt={message.account.display_name || message.account.username}
              src={message.account.avatar}
              className="w-8 aspect-square rounded-full"
              width={32}
              height={32}
            />
          </Link>
        ) : (
          <div className="w-8 h-8"></div>
        ))}
      <div
        className={`max-w-xs space-y-1 p-2 rounded-t-xl ${
          isCurrentUser
            ? "bg-orange-900 text-white rounded-bl-xl"
            : "bg-tab text-white rounded-br-xl"
        }`}
      >
        {message.media_attachments.length > 0 &&
          message.media_attachments.map((media) => (
            <MediaAttachmentPreview
              key={media.id}
              media={media}
              sensitive={false}
            />
          ))}

        {content && editorjsx}
        <span className="text-xs text-[#fff] mt-1">
          {formatTimestamp(message.created_at)}
        </span>
      </div>
    </div>
  );
};

export default ConversationPage;