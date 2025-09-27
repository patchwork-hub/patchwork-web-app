"use client";
import ComposeForm from "@/components/organisms/compose/form/ComposeForm";
import { StatusComposeFormData } from "@/components/organisms/compose/types";
import { useEditStatus } from "@/hooks/mutations/status/useEditStatus";
import { useGetStatus } from "@/hooks/queries/status/useGetStatus";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useMediaStore } from "@/components/organisms/compose/store/useMediaStore";
import { useLinkStore } from "@/components/organisms/compose/store/useLinkStore";
import { useLanguageStore } from "@/components/organisms/compose/store/useLanguageStore";
import { useVisibilityStore } from "@/components/organisms/compose/store/useVisibilityStore";
import { usePollStore } from "@/components/organisms/compose/store/usePollStore";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useModalAction } from "@/components/organisms/modal/modal.context";

export default function EditPost() {
  const { data: currentAccount } = useVerifyAuthToken({
    enabled: true,
  });
  const {closeModal} = useModalAction();
  const queryClient = useQueryClient();
  const statusId = Cookies.get("statusId");
  const editStatusMutation = useEditStatus();
  const { data, isFetching } = useGetStatus(statusId ?? "");
  const { setMediaLocalUrls, setAltTexts, setIsSensitive, setMedia } =
    useMediaStore();
  const { setPreview } = useLinkStore();
  const { setLanguage } = useLanguageStore();
  const { setVisibility } = useVisibilityStore();
  const { setPollOptions, setPollChoiceType } = usePollStore();

  const mediaAttachments = data?.media_attachments || [];

  useEffect(() => {
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("beforeunload", () => {
          Cookies.remove("statusId");
        });
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      if (mediaAttachments.length > 0) {
        setMedia(mediaAttachments);
        setMediaLocalUrls(
          mediaAttachments.map((media) => media.url || media.preview_url)
        );
        setAltTexts(mediaAttachments.map((media) => media.description));
        setIsSensitive(data.sensitive);
      }
      if (data.card) {
        setPreview({
          url: data.card.url,
          title: data.card.title,
          description: data.card.description,
          images: [
            {
              src: data.card.image,
            },
          ],
        });
      }
      setLanguage(data.language);
      setVisibility(data.visibility);
      if (data.poll) {
        setPollOptions(data.poll.options.map((option) => option.title));
        setPollChoiceType(data.poll.multiple ? "multiple" : "single");
      }
    }
  }, [data]);

  const handleSubmit = async (formData: StatusComposeFormData) => {
    const data = await editStatusMutation.mutateAsync({
      id: statusId ?? "",
      formData,
    });
    if (data.id) {
      setTimeout(async () => {
        Cookies.remove("statusId");
        await queryClient.invalidateQueries({
          queryKey: ["status", statusId],
        });
         await queryClient.invalidateQueries({
          queryKey: ["statusList"],
        });
      }, 0);
    }
    closeModal()
    return !!data;
  };

  return statusId ? (
    isFetching ? (
      <h1 className="m-4">Loading...</h1>
    ) : (
      <>
        {data && (
          <ComposeForm
            isEditMode
            hideDraft={false}
            disbledDraft={false}
            hideSchedule={false}
            mediaAttachments={data?.media_attachments}
            loading={editStatusMutation.isPending}
            defaultContent={data.content}
            onSubmit={handleSubmit}
            showPollForm={!!data.poll}
          />
        )}
      </>
    )
  ) : (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
      <h1>Please edit a status from your timeline.</h1>
      <Link
        href={`/@${currentAccount?.acct}`}
        className="rounded bg-orange-500 text-white py-2 px-3"
      >
        Profile
      </Link>
    </div>
  );
}
