"use client";

import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { Input } from "@/components/atoms/ui/input";
import { useLocale } from "@/providers/localeProvider";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import MessageInput from "@/components/organisms/compose/MessageInput";
import { StatusComposeFormData } from "@/components/organisms/compose/types";
import { useCreateStatus } from "@/hooks/mutations/status/useCreateStatus";
import { useUploadMedia } from "@/hooks/mutations/status/useUploadMedia";
import { useViewAllConversations } from "@/hooks/queries/conversations/useViewAllConversations";
import { useSearchQuery } from "@/hooks/queries/search/useSearchQuery";
import { useLookupAccount } from "@/hooks/queries/status/useLookupAccount";
import { fetchFile } from "@/services/media/fetchMediaFiles";
import { Account, Media } from "@/types/status";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useConversationStore } from "@/stores/conversations/conversation";
import GoBack from "@/components/molecules/common/GoBack";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import Image from "next/image";

type Participant = {
  id: string;
  acct: string;
  avatar: string;
  display_name?: string;
  username: string;
  emojis?: MastodonCustomEmoji[];
}

type Message = {
  id: string;
  content: string;
  media_attachments: Media[];
  created_at: string;
  account: {
    username: string;
  };
}

const NewConversationPage: FC = () => {
  const searchParams = useSearchParams();
  const acct = searchParams.get("acct");
  const {t} = useLocale();
  const { data: account } = useLookupAccount(acct??"");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (account) {
      setSelectedParticipants([account as Participant]);
    }
  }, [account]);

  const setConversation = useConversationStore(
    (state) => state.setConversation
  );

  const { isLoading: isSearching, data: searchResults } = useSearchQuery({
    query: searchQuery,
    type: "accounts",
    enabled: !!searchQuery,
  });

  const {
    data: newMessage,
    mutate: sendMessage,
    isPending: isSendingMessage,
  } = useCreateStatus();
  const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia();

  const {
    data: conversations,
    refetch: fetchConversations,
    isLoading: isLoadingConversations,
  } = useViewAllConversations();

  const { editor } = useTipTapEditor({
    disableMentions: true,
    content: "",
    placeholder: `${t("convetsations.your_message") as string}`,
    className:
      "flex-1 p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none",
  });

  const handleAddParticipant = useCallback((participant: Participant) => {
    setSelectedParticipants(prev => {
      if (!prev.find((p) => p.id === participant.id)) {
        return [...prev, participant];
      }
      return prev;
    });
    setSearchQuery(""); // Clear search after selection
  }, []);

  const handleRemoveParticipant = (id: string) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== id));
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

  const handleSendMessage = (messageContent: string) => {
    if (selectedParticipants.length === 0) return;
    const formData: StatusComposeFormData = {
      status:
        selectedParticipants.map((p) => `@${p.acct}`).join(" ") +
        " " +
        messageContent,
      media_ids: uploadedMedias.map((media) => media.id),
      language: "en",
      visibility: "direct",
    };

    sendMessage({ formData });

    const new_msg = {
      id: Date.now().toString(),
      content: messageContent,
      media_attachments: uploadedMedias,
      created_at: new Date().toISOString(),
      account: { username: "current_user" },
    };
    setMessageHistory([...messageHistory, new_msg]);
    setUploadedMedias([]);
    editor?.commands.clearContent();
  };

  useEffect(() => {
    if (newMessage) {
      fetchConversations();
    }
  }, [newMessage]);

  useEffect(() => {
    if (newMessage && conversations) {
      let conversation;
      conversations.pages.forEach((page) => {
        conversation = page.conversations.find(
          (conversation) => conversation?.last_status?.id === newMessage.id
        );
      });
      if (conversation) {
        setConversation(conversation);
        router.push("/conversations/chat");
      }
    }
  }, [newMessage, conversations]);

  // Extracted reusable component for ParticipantChip
  const ParticipantChip: React.FC<{
    participant: Participant;
    onRemove: (id: string) => void;
  }> = ({ participant, onRemove }) => {
    const { editorjsx } = useTipTapEditor({
      editable: false,
      content: participant.display_name || participant.username,
      emojis: participant.emojis,
      contentClassName: "text-white",
    });
    return (
      <div className="flex items-center space-x-1 bg-primary px-2 py-1 rounded-lg">
        <Image
          src={participant.avatar}
          alt={participant.display_name as string}
          className="w-6 h-6 rounded-full"
          width={24}
          height={24}
        />
        {editorjsx}
        <button onClick={() => onRemove(participant.id)}>
          <X className="w-4 h-4 text-[#fff]" />
        </button>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[calc(100dvh-64px)] sm:h-screen text-white">
      <div className="p-4 border-b-[0.5px] border-gray-600">
        <div className="absolute top-4 left-4">
          <GoBack className="opacity-80 text-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-foreground text-center">
          {t("screen.new_message")}
        </h1>
      </div>

      {/* Participants Section */}
      <div className="p-4 border-b-[0.5] border-gray-600">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {selectedParticipants.map((participant) => (
            <ParticipantChip
              key={participant.id}
              participant={participant}
              onRemove={handleRemoveParticipant}
            />
          ))}
        </div>
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("conversation.search_by_name_or_username") as string}
            className="w-full p-2 rounded-lg text-foreground border border-gray-600 placeholder-gray-400 focus:outline-none"
          />
          {(isSearching || searchResults && searchResults?.accounts?.length > 0) && (
            <div className="absolute z-10 w-full mt-1 dark:bg-primary border border-secondary rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching && (
                <div className="p-2 flex justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {searchResults && searchResults?.accounts?.length > 0 && !isSearching && (
                <ul className="py-1">
                  {searchResults.accounts.map((account) => (
                    <SearchItem
                      key={account.id}
                      account={account}
                      onClick={() => handleAddParticipant(account as Participant)}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message History Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messageHistory.map((message) => (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-xs p-3 rounded-lg bg-orange-500 text-white">
                {message.media_attachments.length > 0 &&
                  message.media_attachments.map((media: Media) => (
                    <Image
                      key={media.id}
                      src={media.preview_url}
                      alt="attachment"
                      className="w-[200px] rounded-lg"
                      width={200}
                      height={200}
                    />
                  ))}
                <p>{message.content}</p>
                <span className="text-xs text-white/80 mt-1">
                  {dayjs(message.created_at).format("h:mm A")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {selectedParticipants.length > 0 && (
        <MessageInput
          className="p-4 border-t border-gray-700"
          isLoadingGifv={isLoadingGifv}
          isUploading={isUploading}
          isSending={isSendingMessage || isLoadingConversations}
          onSendMessage={handleSendMessage}
          onUploadMedia={handleUploads}
          uploadedMedias={uploadedMedias}
          onRemoveMedia={(mediaId) =>
            setUploadedMedias(uploadedMedias.filter((m) => m.id !== mediaId))
          }
          onGifvSelect={handleGifvSelect}
          placeholder={t("conversation.your_message") as string}
        />
      )}
    </div>
  );
};

const SearchItem = ({
  account,
  onClick,
}: {
  account: Account;
  onClick: (account: Account) => void;
}) => {
  const { editorjsx } = useTipTapEditor({
    editable: false,
    content: account.display_name || account.username,
    emojis: account.emojis as MastodonCustomEmoji[],
    contentClassName: "dark:text-white",
  });
  return (
    <li
      className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-500 text-white cursor-pointer"
      onClick={() => onClick(account)}
    >
      <Image
        src={account.avatar}
        alt={account.display_name}
        className="w-6 h-6 rounded-full"
        width={24}
        height={24}
      />
      <span>{editorjsx}</span>
    </li>
  );
};

export default NewConversationPage;
