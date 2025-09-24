"use client";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { useTipTapEditor } from "@/components/organisms/compose/hooks/useTipTapEditor";
import MastodonEmojiPicker from "@/components/organisms/compose/tools/Emoji";
import { GifvModal } from "@/components/organisms/compose/tools/Gifv";
import { cn } from "@/lib/utils";
import { Media } from "@/types/status";
import { isSystemDark } from "@/utils/helper/helper";
import { Image, Send, X } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

type Mention = {
  id: string;
  username: string;
  url: string;
  acct: string;
};
interface MessageInputProps {
  placeholder?: string;
  isLoadingGifv: boolean;
  isUploading: boolean;
  isSending: boolean;
  onSendMessage: (message: string) => void;
  onUploadMedia: (files: File[]) => Promise<void>;
  uploadedMedias: Media[];
  onRemoveMedia: (mediaId: string) => void;
  onGifvSelect: (url: string) => Promise<void>;
  className?: string;
  mentions?: Mention[];
  ownAcct?: string | null;
}

const MessageInput: FC<MessageInputProps> = ({
  isUploading,
  isLoadingGifv,
  isSending,
  onSendMessage,
  onUploadMedia,
  uploadedMedias,
  onRemoveMedia,
  onGifvSelect,
  mentions,
  ownAcct,
  placeholder = "Your message...",
  className,
}) => {
  const { theme } = useTheme();
  const { editor, editorjsx } = useTipTapEditor({
    // disableMentions: true,
    content: "",
    placeholder,
    className: `flex-1 p-2 border-1 rounded-lg focus:outline-none ${
     theme === "dark" || (theme === "system" && isSystemDark) ? "border-gray-600" : "border-gray-200"
    }`,
    contentClassName: "text-foreground",
    onPressEnter: handleSendMessage,
  });

  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  

  function handleSendMessage() {
    const messageContent = editor?.getText()?.trim();
    if (!messageContent && uploadedMedias && uploadedMedias?.length === 0)
      return;
    onSendMessage(messageContent || "");
    editor?.commands.clearContent();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    onUploadMedia(files);
  };
  useEffect(() => {
    if (editor) {
      editor.commands.clearContent();

      if (ownAcct) {
        editor.commands.insertContent({
          type: "mention",
          attrs: { label: `@${ownAcct}` },
        });
        editor.commands.insertContent(" ");
      }

      mentions &&
        mentions.forEach((mention) => {
          editor.commands.insertContent({
            type: "mention",
            attrs: { label: `@${mention.acct}`, class: "text-orange-500" },
          });
          editor.commands.insertContent(" ");
        });

      editor.commands.focus("end");
    }
  }, [editor, mentions]);
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {isUploading || isLoadingGifv ? (
          <div className="w-20 h-20 custom-slide rounded-lg"></div>
        ) : null}
        {uploadedMedias?.map((media) => (
          <div key={media.id} className="relative w-20 h-20">
            <img
              src={media.preview_url}
              alt="attachment"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => onRemoveMedia(media.id)}
              className="absolute -top-2 -right-2 bg-[#96A6C2] rounded-full p-1 hover:opacity-90 transition-colors"
            >
              <X className="w-4 h-4 text-[#fff]" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor="image-upload"
          className="flex items-center rounded-md text-foreground cursor-pointer"
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
            value=""
          />
          <Image className="w-5 h-5" />
        </label>
        <Popover open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
          <PopoverTrigger asChild>
            <button className="text-foreground cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 -960 960 960"
              >
                <path
                  fill="currentColor"
                  d="M612-516q25 0 42.5-17.5T672-576t-17.5-42.5T612-636t-42.5 17.5T552-576t17.5 42.5T612-516m-264 0q25 0 42.5-17.5T408-576t-17.5-42.5T348-636t-42.5 17.5T288-576t17.5 42.5T348-516m132 228q60 0 110.5-31t79.5-84H290q29 53 79.5 84T480-288m.28 192Q401-96 331-126t-122.5-82.5T126-330.96t-30-149.5 30-149.04 82.5-122T330.96-834t149.5-30 149.04 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5T629.28-126q-69.73 30-149 30m-.28-72q130 0 221-91t91-221-91-221-221-91-221 91-91 221 91 221 221 91"
                ></path>
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <MastodonEmojiPicker
              onEmojiSelect={(emoji) => {
                editor?.commands.insertContent(
                  emoji.native ?? emoji.shortcodes
                );
                setOpenEmojiPicker(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <GifvModal
          className="!px-0"
          noTooltip
          asButton={false}
          onSelect={onGifvSelect}
        />
        {editorjsx}
        <button
          disabled={isSending}
          className="text-gray-400"
          onClick={handleSendMessage}
        >
          {isSending ? (
            <LoadingSpinner className="w-6 h-6" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
