import { Button } from "@/components/atoms/ui/button";
import { StatusSkeleton } from "@/components/molecules/skeletons/Status.Skeleton";
import { useCreateStatus } from "@/hooks/mutations/status/useCreateStatus";
import { useUploadMedia } from "@/hooks/mutations/status/useUploadMedia";
import { useGetContext } from "@/hooks/queries/status/useGetContext";
import { useGetStatus } from "@/hooks/queries/status/useGetStatus";
import { fetchFile } from "@/services/media/fetchMediaFiles";
import { Media } from "@/types/status";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import MessageInput from "../compose/MessageInput";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";
import { useLocale } from "@/providers/localeProvider";
import { Visibility } from "@/types/preferences";

type ContextProps = {
  id: string;
  currentAcct: string;
  domain?: string;
};
export const Context: FC<ContextProps> = ({
  id,
  currentAcct: acct,
  domain,
}) => {
  const router = useRouter();
  const { t } = useLocale();
  const { data: status, isPending: isFetchingStatus } = useGetStatus(
    id,
    domain
  );
  const { data: context, isPending: isFetchingContext } = useGetContext(
    id,
    domain
  );
  const createStatusMutation = useCreateStatus();
  const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia();
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);

  const onUploadMedia = async (files: File[]) => {
    const mediaFiles = Array.from(files);
    const media = await Promise.all(
      mediaFiles.map(async (file) => {
        return await uploadMedia({ file, description: "" });
      })
    );
    setUploadedMedias([...uploadedMedias, ...media]);
  };

  function handleReply(message: string) {
    const replyContent = `${message}`;

    createStatusMutation.mutate({
      formData: {
        status: replyContent,
        in_reply_to_id: status?.id,
        visibility: status?.visibility as Visibility,
        language: "en",
        media_ids: uploadedMedias.map((media) => media.id),
      },
      differentOrigin:
        status && status.account.acct.includes("@") &&
        !status.account.acct.includes("@" + Cookies.get("domain")),
      url: status && status.url,
    });
    setUploadedMedias([]);
  }

  const [isLoadingGifv, setIsLoadingGifv] = useState(false);

  const handleGifvSelect = async (url: string) => {
    setIsLoadingGifv(true);
    const file = await fetchFile(url);
    setIsLoadingGifv(false);
    const media = await uploadMedia({ file, description: "" });
    setUploadedMedias((prev) => [...prev, media]);
  };

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return (
    <div className="pb-16 sm:pb-0 relative max-h-screen overflow-auto">
      <Button onClick={() => router.back()} className="w-fit ml-4 my-4">
        <ArrowLeft className="text-white"/>
      </Button>
      {isFetchingStatus || isFetchingContext || isLoadingEmojis ? (
        <div className="px-4">
          <StatusSkeleton />
        </div>
      ) : (
        <>
          <div>
            {context?.ancestors?.map((reply) => (
              <Status
                key={reply.id}
                className="not-first:border-t-0"
                thread
                status={reply}
                ownStatus={reply.account.acct === acct}
                showEdit={reply.account.acct === acct && !reply.reblog}
              />
            ))}
            {status && (
              <Status
                status={status}
                detail
                ownStatus={status.account.acct === acct}
                showEdit={status.account.acct === acct && !status.reblog}
              />
            )}
            <div>
              {context?.descendants?.map((reply) => (
                <Status
                  key={reply.id}
                  className="not-first:border-t-0"
                  thread
                  status={reply}
                  ownStatus={reply.account.acct === acct}
                  showEdit={reply.account.acct === acct && !reply.reblog}
                />
              ))}
            </div>
          </div>
          <div
            className={`sticky bottom-0 left-0 w-full flex flex-col border-y-[0.5px] py-4 space-y-2 px-3 border-gray-300 dark:border-gray-600 bg-background`}
          >
            <MessageInput
              placeholder={t("status.reply") as string}
              isUploading={isUploading}
              isLoadingGifv={isLoadingGifv}
              onUploadMedia={onUploadMedia}
              isSending={createStatusMutation?.isPending}
              onSendMessage={handleReply}
              uploadedMedias={uploadedMedias}
              onRemoveMedia={(mediaId) =>
                setUploadedMedias(
                  uploadedMedias?.filter((m) => m?.id !== mediaId)
                )
              }
              mentions={status?.mentions || []}
              ownAcct={
                status?.account?.acct !== acct ? status?.account?.acct : null
              }
              onGifvSelect={handleGifvSelect}
            />
          </div>
        </>
      )}
    </div>
  );
};
