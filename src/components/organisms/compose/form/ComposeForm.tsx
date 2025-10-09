"use client";

import { Button } from "@/components/atoms/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { useCreateDraft } from "@/hooks/mutations/drafts/useCreateDraft";
import { useDeleteDraft } from "@/hooks/mutations/drafts/useDeleteDraft";
import { useUpdateDraft } from "@/hooks/mutations/drafts/useUpdateDraft";
import { useUpdateSchedule } from "@/hooks/mutations/schedule/useUpdateSchedule";
import { useUploadMedia } from "@/hooks/mutations/status/useUploadMedia";
import { cn } from "@/lib/utils";
import { fetchFile } from "@/services/media/fetchMediaFiles";
import { DraftComposeFormData } from "@/types/draft";
import { Media } from "@/types/status";
import { format, parseISO } from "date-fns";
import { ImageIcon, ListIcon, Square, SquareCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoWarningOutline } from "react-icons/io5";
import { toast } from "sonner";
import { initialState, reducer } from "../reducer";
import { useDraftStore } from "../store/useDraftStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useLinkStore } from "../store/useLinkStore";
import { useMediaStore } from "../store/useMediaStore";
import { usePollStore } from "../store/usePollStore";
import { useScheduleStore } from "../store/useScheduleStore";
import { useVisibilityStore } from "../store/useVisibilityStore";
import { Drafts } from "../tools/Drafts";
import { GifvModal } from "../tools/Gifv";
import { LanguageModal } from "../tools/LanguageModal";
import { LinkPreviewer } from "../tools/LinkPreview";
import { MediaPreview } from "../tools/MediaPreview";
import { SaveAsDraftModal } from "../tools/SaveAsDraftModal";
import { VisibilityDropdown } from "../tools/VisibilityDropdown";
import {
  LinkPreview,
  POLL_INITIAL,
  POLL_LIMITS,
  StatusComposeFormData,
} from "../types";
import MastodonEmojiPicker from "../tools/Emoji";
import { extractLinkPreview } from "../utils/extractLinkPreview";
import { getCharCount } from "../utils/getCharCount";
import PollForm from "./PollForm";
import { Modal } from "@/components/atoms/ui/modal";
import { useFavouriteChannelLists } from "@/hooks/queries/useFavouriteChannelList.query";
import { DEFAULT_API_URL } from "@/utils/constant";
import { TooltipContent } from "@/components/atoms/ui/tooltip";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import { debounce } from "lodash";
import { useModalAction } from "../../modal/modal.context";
import { isSystemDark } from "@/utils/helper/helper";
import { DateTimePicker } from "@/components/molecules/common/datePicker";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import { useAuthStore } from "@/stores/auth/authStore";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import { useLocale } from "@/providers/localeProvider";
import Image from "next/image";

type ComposeFormProps = {
  defaultContent?: string;
  onSubmit: (data: StatusComposeFormData) => Promise<boolean>;
  showPollForm?: boolean;
  loading?: boolean;
  mediaAttachments?: Media[];
  isEditMode?: boolean;
  hideDraft?: boolean;
  disbledDraft?: boolean;
  hideSchedule?: boolean;
};
type CommunityHashtag = {
  hashtag: string;
};

type HashtagWithCommunity = {
  hashtag: string;
  communityId: string;
};
const ComposeForm: React.FC<ComposeFormProps> = ({
  onSubmit,
  defaultContent,
  showPollForm = false,
  loading = false,
  mediaAttachments,
  isEditMode,
  hideDraft,
  hideSchedule,
  disbledDraft,
}) => {
  const domain_name = Cookies.get("domain");
  const { closeModal } = useModalAction();
  const { t } = useLocale();
  const { data: server } = useSearchServerInstance({
    enabled: true,
    domain: domain_name,
  });
  const [selectedHashtags, setSelectedHashtags] = useState<
    Array<{ hashtag: string; communityId: string }>
  >([]);
  const [longPost] = useState(false);
  const { userOriginInstance } = useAuthStore();
  const { theme } = useTheme();
  const [showCommuityList, setShowCommunityList] = useState(false);
  const [selectedCommunities] = useState([]);
  const max_characters = server?.configuration?.statuses?.max_characters;

  const [totalCharCount, setTotalCharCount] = useState(
    longPost ? max_characters || 20000 : 500
  );
  const [remainingCount, setRemainingCount] = useState(totalCharCount);
  const [progressValue, setProgressValue] = useState(0);

  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const { editor, editorjsx } = useTipTapEditor({
    minHeight: "min-h-[40px]",
    className: "text-white p-2",
    content: defaultContent || "",
    maxLength: max_characters,
    placeholder: t("compose.placeholder") as string,
  });
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    showPollForm,
  });

  const { mutate: deleteDraft } = useDeleteDraft();

  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreateDraft();

  const { mutateAsync: updateDraft, isPending: isUpdatingDraft } =
    useUpdateDraft();

  const { mutateAsync: updateSchedule, isPending: isUpdatingSchedule } =
    useUpdateSchedule();

  const {
    media,
    mediaLocalUrls,
    setMediaLocalUrls,
    setAltTexts,
    isSensitive,
    setIsSensitive,
    setMedia,
    uploading,
    setUploading,
    mediaAttributes,
    reset: resetImages,
  } = useMediaStore();

  const { preview, setPreview } = useLinkStore();
  const { language, setLanguage } = useLanguageStore();
  const { visibility, setVisibility } = useVisibilityStore();
  const {
    pollOptions,
    setPollOptions,
    pollChoiceType,
    setPollChoiceType,
    pollDuration,
    setPollDuration,
  } = usePollStore();
  const { mutateAsync: uploadMedia, isPending } = useUploadMedia();

  const { data: favouriteChannelLists, isLoading: favLoading } =
    useFavouriteChannelLists({
      enabled: userOriginInstance === DEFAULT_API_URL,
      instance_domain: userOriginInstance,
      platform_type: "newsmast.social",
    });
  const {
    removeDraft,
    draft,
    setSaveAsDraftModalOpen,
    setIsDirty,
  } = useDraftStore();
  const { removeSchedule, schedule } = useScheduleStore();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const isDirty = draft || editor?.getText().trim() || media.length > 0;

  useEffect(() => {
    setIsDirty(!!isDirty);
    return () => {
      setIsDirty(false);
    };
  }, [isDirty, setIsDirty]);

  const router = useRouter();

 const uploadFiles = useCallback(async (files: File[]) => {
  const indices = files.map(() => true);
  setUploading(indices);
  const media_res = await Promise.all(
    files.map(async (file, idx) => {
      const media = await uploadMedia({ file, description: "" });
      indices[idx] = false;
      setUploading([...indices]);
      return media;
    })
  );
  setMedia(media_res);
}, [setUploading, setMedia, uploadMedia]);

  const resetForm = useCallback(() => {
  if (editor) {
    editor.commands.clearContent();
  }
  setDate(undefined);
  dispatch({ type: "RESET_FORM" });
  resetImages();
  setLanguage("en");
  setPollOptions(POLL_INITIAL.options);
  setPollChoiceType(POLL_INITIAL.multiple ? "multiple" : "single");
  setPollDuration(POLL_INITIAL.expires_in);
  dispatch({ type: "TOGGLE_POLL_FORM", payload: false });
  setPreview(undefined);
}, [
  editor,
  setDate,
  dispatch,
  resetImages,
  setLanguage,
  setPollOptions,
  setPollChoiceType,
  setPollDuration,
  setPreview,
]);

  const handleSave = async () => {
    if (
      !editor ||
      (editor.getText().trim().length === 0 &&
        media.length === 0 &&
        mediaAttributes.length === 0)
    )
      return;
    if (editor.getText().length > 500 && !longPost) {
      toast.error(t("toast.long_post_error"));
      return;
    }

    const hashtagText = selectedHashtags.map((h) => `#${h.hashtag}`).join(" ");
    const currentEditorText = editor.getText().trim();
    const statusContent = hashtagText
      ? `${currentEditorText}\n\n${hashtagText}`.trim()
      : currentEditorText;

    const formData: StatusComposeFormData = {
      status: statusContent,
      visibility,
      language,
      media_ids: media.map((m) => m.id),
      media_attributes: mediaAttributes,
      sensitive: isSensitive,
      scheduled_at: date
        ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSX")
        : undefined,
    };
    if (
      pollOptions.length >= POLL_LIMITS.MIN_OPTIONS &&
      pollOptions.every((option) => option.trim().length > 0)
    ) {
      formData.poll = {
        options: pollOptions,
        multiple: pollChoiceType === "multiple",
        expires_in: pollDuration,
      };
    }

    onSubmit(formData).then((isSuccess) => {
      if (isSuccess) {
        if(date){
          toast.success(t("toast.schedule_created"));
        }
        resetForm();
        if (draft) {
          deleteDraft(draft.id);
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (schedule) {
      const hashtagText = selectedHashtags
        .map((h) => `#${h.hashtag}`)
        .join(" ");
      const currentEditorText = editor?.getText().trim();
      const statusContent = hashtagText
        ? `${currentEditorText}\n\n${hashtagText}`.trim()
        : currentEditorText;

      const formData: StatusComposeFormData = {
        status: statusContent ?? "",
        visibility,
        language,
        media_ids: media.map((m) => m.id),
        media_attributes: mediaAttributes,
        sensitive: isSensitive,
        scheduled_at: date
          ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSX")
          : undefined,
      };
      if (
        pollOptions.length >= POLL_LIMITS.MIN_OPTIONS &&
        pollOptions.every((option) => option.trim().length > 0)
      ) {
        formData.poll = {
          options: pollOptions,
          multiple: pollChoiceType === "multiple",
          expires_in: pollDuration,
        };
      }
      updateSchedule({ id: schedule.id, data: formData }).then((isSuccess) => {
        if (isSuccess) {
          toast.success(t("toast.schedule_updated"));
          resetForm();
          removeSchedule();
          router.push("/home");
          closeModal();
        }
      });
    } else {
      handleSave();
    }
  };

  const onFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    const imgs: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imgs.push(reader.result as string);
        setMediaLocalUrls([...imgs]);
      };
      reader.readAsDataURL(file);
    });

    uploadFiles(files);
  };

  const handleSaveDraft = () => {
    const hashtagText = selectedHashtags.map((h) => `#${h.hashtag}`).join(" ");
    const currentEditorText = editor?.getText().trim();
    const statusContent = hashtagText
      ? `${currentEditorText}\n\n${hashtagText}`.trim()
      : currentEditorText;
    const draftComposeFormData: DraftComposeFormData = {
      poll:
        pollOptions &&
        pollOptions.length >= POLL_LIMITS.MIN_OPTIONS &&
        pollOptions.every((option) => option.trim().length > 0)
          ? {
              options: pollOptions,
              multiple: pollChoiceType === "multiple",
              expires_in: pollDuration,
            }
          : undefined,
      status: statusContent ?? "",
      visibility,
      language,
      media_ids: media.map((m) => m.id),
      sensitive: isSensitive,
      drafted: true,
    };
    if (draft) {
      return updateDraft({
        id: draft.id,
        data: draftComposeFormData,
      });
    } else {
      return createDraft(draftComposeFormData);
    }
  };

  useEffect(() => {
    if (draft && !disbledDraft) {
      resetForm();
      const {
        text,
        text_count,
        poll: draftPoll,
        visibility,
        language,
        sensitive,
      } = draft.params;
      if (editor) {
        editor.commands.setContent(text);
      }
      setMedia(draft.media_attachments);
      setMediaLocalUrls(
        draft.media_attachments.map((media) => media.url || media.preview_url)
      );
      setAltTexts(draft.media_attachments.map((media) => media.description));
      setLanguage(language);
      setIsSensitive(sensitive);
      setVisibility(visibility);
      dispatch({ type: "SET_CHAR_COUNT", payload: text_count });

      if (draftPoll) {
        dispatch({ type: "TOGGLE_POLL_FORM", payload: true });
        setPollOptions(draftPoll.options);
        setPollChoiceType(draftPoll.multiple ? "multiple" : "single");
      } else {
        dispatch({ type: "TOGGLE_POLL_FORM", payload: false });
        setPollOptions(POLL_INITIAL.options);
        setPollChoiceType(POLL_INITIAL.multiple ? "multiple" : "single");
      }
    }

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const controller = new AbortController();
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        if (isDirty) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      window.addEventListener("beforeunload", beforeUnloadHandler, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
      };
    }
  }, [draft, isDirty, disbledDraft, editor, resetForm, setAltTexts, setIsSensitive, setLanguage, setMedia, setMediaLocalUrls, setPollChoiceType, setPollOptions, setVisibility]);

  const debouncedExtractPreview = debounce(
    (text: string, callback: (preview: LinkPreview | undefined) => void) => {
      extractLinkPreview(text, callback);
    },
    500
  );

  useEffect(() => {
    return () => {
      removeDraft();
      resetForm();
    };
  }, [ removeDraft, resetForm]);

  useEffect(() => {
    if (schedule) {
      resetForm();
      const {
        text,
        text_count,
        poll: schedulePoll,
        visibility,
        language,
        sensitive,
      } = schedule.params;
      if (editor) {
        editor.commands.setContent(text);
      }
      setMedia(schedule.media_attachments);
      setMediaLocalUrls(
        schedule.media_attachments.map(
          (media) => media.url || media.preview_url
        )
      );
      setAltTexts(schedule.media_attachments.map((media) => media.description));
      setLanguage(language);
      setIsSensitive(sensitive);
      setVisibility(visibility);
      setDate(parseISO(schedule.scheduled_at));
      dispatch({ type: "SET_CHAR_COUNT", payload: text_count });

      if (schedulePoll) {
        dispatch({ type: "TOGGLE_POLL_FORM", payload: true });
        setPollOptions(schedulePoll.options);
        setPollChoiceType(schedulePoll.multiple ? "multiple" : "single");
      } else {
        dispatch({ type: "TOGGLE_POLL_FORM", payload: false });
        setPollOptions(POLL_INITIAL.options);
        setPollChoiceType(POLL_INITIAL.multiple ? "multiple" : "single");
      }
    }
  }, [schedule, editor, resetForm, setAltTexts, setIsSensitive, setLanguage, setMedia, setMediaLocalUrls, setPollChoiceType, setPollOptions, setVisibility]);
  
  const getSelectedHashtags = useCallback(() => {
    return selectedHashtags;
  }, [selectedHashtags]);

  useEffect(() => {
    const newTotalCharCount = longPost ? max_characters || 500 : 500;

    setTotalCharCount(newTotalCharCount);
    setRemainingCount(
      newTotalCharCount - state.charCount >= 0
        ? newTotalCharCount - state.charCount
        : 0
    );
    setProgressValue((state.charCount / newTotalCharCount) * 100);
  }, [longPost, max_characters, state.charCount]);

  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const editorCharCount = getCharCount(text);

      const currentUrls: string[] = text.match(/https?:\/\/[^\s]+/g) || [];
      const lastUrl = currentUrls[currentUrls.length - 1];

      const hashtags = getSelectedHashtags();
      const hashtagText = hashtags.map((h) => `#${h.hashtag}`).join(" ");
      const hashtagLength = hashtagText.length || 0;

      const totalCharCountWithHashtags = editorCharCount + hashtagLength;

      if (totalCharCountWithHashtags !== state.charCount) {
        dispatch({
          type: "SET_CHAR_COUNT",
          payload: totalCharCountWithHashtags,
        });

        setRemainingCount(
          totalCharCount - totalCharCountWithHashtags >= 0
            ? totalCharCount - totalCharCountWithHashtags
            : 0
        );
        setProgressValue((totalCharCountWithHashtags / totalCharCount) * 100);
      }

      if (preview?.url && !currentUrls.includes(preview.url)) {
        setPreview(undefined);
        return;
      }
      if ((!preview || preview.url !== lastUrl) && lastUrl) {
        debouncedExtractPreview(text, setPreview);
      }
    }
    return () => debouncedExtractPreview.cancel();
  }, [
    editor?.state.doc.content,
    selectedHashtags,
    totalCharCount,
    state.charCount,
    preview,
    editor,
    dispatch,
    debouncedExtractPreview,
    setPreview,
    getSelectedHashtags
  ]);
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        const files: File[] = [];
        const localUrls: string[] = [];
        for (const item of items) {
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (
              file &&
              (file.type.startsWith("image/") || file.type.startsWith("video/"))
            ) {
              files.push(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                localUrls.push(reader.result as string);
                setMediaLocalUrls([...mediaLocalUrls, ...localUrls]);
              };
              reader.readAsDataURL(file);
            }
          }
        }
        if (files.length > 0) {
          event.preventDefault();
          uploadFiles(files);
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [uploadFiles, mediaLocalUrls, setMediaLocalUrls]);

  const handleCloseModal = () => {
    if (isDirty && !disbledDraft) {
      setSaveAsDraftModalOpen(true);
    } else {
      closeModal();
    }
  };

  const onConfirmSaveAsDraft = () => {
    handleSaveDraft().then(() => {
      toast.success(t("tosat.saved_draft"));
    });
  };

  const onGifvSelect = async (url: string) => {
    setMediaLocalUrls(mediaLocalUrls ? [...mediaLocalUrls, url] : [url]);
    const file = await fetchFile(url);
    setUploading(uploading ? [...uploading, true] : [true]);
    const new_media = await uploadMedia({ file, description: "" });
    setUploading(uploading ? [...uploading, false] : [false]);
    setMedia(media ? [...media, new_media] : [new_media]);
  };

  const handleCommunityToggle = (communityId: string) => {
    const community = favouriteChannelLists?.find((c) => c.id === communityId);
    if (!community) return;

    const communityHashtags =
      community.attributes.patchwork_community_hashtags || [];

    if (selectedHashtags.some((h) => h.communityId === communityId)) {
      setSelectedHashtags((prev) =>
        prev.filter((h) => h.communityId !== communityId)
      );
    } else {
      const newHashtags: HashtagWithCommunity[] = communityHashtags.map(
        (h: CommunityHashtag) => ({
          hashtag: h.hashtag,
          communityId,
        })
      );
      setSelectedHashtags((prev) => [...prev, ...newHashtags]);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedHashtags.length ===
      (favouriteChannelLists?.reduce(
        (total, community) =>
          total +
          (community.attributes.patchwork_community_hashtags?.length || 0),
        0
      ) || 0)
    ) {
      setSelectedHashtags([]);
    } else {
      type Community = {
        id: string;
        attributes: {
          patchwork_community_hashtags?: CommunityHashtag[];
        };
      };

      const allHashtags: HashtagWithCommunity[] =
        (favouriteChannelLists as Community[])?.flatMap(
          (community: Community) =>
            (community.attributes.patchwork_community_hashtags || []).map(
              (h: CommunityHashtag) => ({
                hashtag: h.hashtag,
                communityId: community.id,
              })
            )
        ) || [];
      setSelectedHashtags(allHashtags);
    }
  };

  useEffect(() => {
    const hashtags = getSelectedHashtags();
    const hashtagText = hashtags.map((h) => `#${h.hashtag}`).join(" ");
    dispatch({ type: "SET_CHAR_COUNT", payload: hashtagText.length });
  }, [selectedCommunities, dispatch, getSelectedHashtags, selectedHashtags]);

  const buttonText =
    selectedHashtags.length ===
    (favouriteChannelLists?.reduce(
      (total, community) =>
        total +
        (community.attributes.patchwork_community_hashtags?.length || 0),
      0
    ) || 0)
      ? "Deselect all"
      : "Select all";

  useEffect(() => {
    const hashtagText = selectedHashtags.map((h) => `#${h.hashtag}`).join(" ");
    const hashtagLength = hashtagText.length;

    if (hashtagLength > 0) {
      dispatch({
        type: "SET_CHAR_COUNT",
        payload: state.charCount + hashtagLength + 1,
      });
    }
  }, [selectedHashtags, state.charCount]);

  useEffect(() => {
    const contentToParse = draft?.params?.text || defaultContent;
    if (!contentToParse || !favouriteChannelLists) return;

    let extractedHashtags: HashtagWithCommunity[] = [];
    let mainContent: string;

    if (draft?.params?.text) {
      const [contentPart, hashtagsPart] = contentToParse.split("\n\n");
      mainContent = contentPart || "";
      if (hashtagsPart) {
        extractedHashtags =
          hashtagsPart.match(/#(\w+)/g)?.map((match) => {
            const hashtag = match.replace("#", "");
            type ExtractedHashtag = {
              hashtag: string;
              communityId: string;
            };

            type Community = {
              id: string;
              attributes: {
                patchwork_community_hashtags?: Array<{ hashtag: string }>;
              };
            };

            return {
              hashtag,
              communityId:
                favouriteChannelLists.find((community: Community) =>
                  community.attributes.patchwork_community_hashtags?.some(
                    (h: { hashtag: string }) => h.hashtag === hashtag
                  )
                )?.id || "default",
            } as ExtractedHashtag;
          }) || [];
      }
    } else {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = contentToParse;
      const paragraphs = tempDiv.querySelectorAll("p");

      mainContent = paragraphs[0]?.innerHTML || "";

      for (let i = 1; i < paragraphs.length; i++) {
        const hashtagLinks =
          paragraphs[i].querySelectorAll("a.mention.hashtag");

        Array.from(hashtagLinks).forEach((link) => {
          const hashtag = link.querySelector("span")?.textContent || "";
          extractedHashtags.push({
            hashtag,
            communityId:
              favouriteChannelLists.find(
                (community: {
                  id: string;
                  attributes: {
                    patchwork_community_hashtags?: Array<{ hashtag: string }>;
                  };
                }) =>
                  community.attributes.patchwork_community_hashtags?.some(
                    (h: { hashtag: string }) => h.hashtag === hashtag
                  )
              )?.id || "default",
          });
        });
      }
    }

    if (editor && editor.getText() !== mainContent) {
      editor.commands.setContent(mainContent);
    }

    if (!arraysEqual(extractedHashtags, selectedHashtags)) {
      setSelectedHashtags(extractedHashtags);
    }
  }, [draft, defaultContent, favouriteChannelLists, isEditMode, editor, selectedHashtags, setSelectedHashtags]);
  function arraysEqual(a: HashtagWithCommunity[], b: HashtagWithCommunity[]) {
    return (
      a.length === b.length &&
      a.every(
        (val, index) =>
          val.hashtag === b[index].hashtag &&
          val.communityId === b[index].communityId
      )
    );
  }

  const handleRemoveHashtag = (
    hashtagToRemove: string,
    communityId: string
  ) => {
    setSelectedHashtags((prev) => {
      const newHashtags = prev.filter(
        (h) => !(h.hashtag === hashtagToRemove && h.communityId === communityId)
      );

      return newHashtags;
    });

    if (communityId === "default" && editor) {
      const currentContent = editor.getHTML();
      const hashtagRegex = new RegExp(
        `<a[^>]*class="mention hashtag"[^>]*>#<span>${hashtagToRemove}</span></a>`,
        "g"
      );
      const updatedContent = currentContent.replace(hashtagRegex, "");

      setTimeout(() => {
        editor.commands.setContent(updatedContent);
      }, 0);
    }
  };
  return (
    <div className="h-full rounded">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center space-x-2">
          <Button
            className={cn(
              "px-2 bg-gray-600 hover:bg-[#aac2eb] hover:text-black!"
            )}
            // onClick={handleBackButton}
            onClick={() => handleCloseModal()}
          >
            Close
          </Button>
          <Button
            className="px-2 bg-green-700 w-fit hover:text-white!"
            loading={loading || isUpdatingSchedule}
            disabled={
              isPending ||
              loading ||
              isCreatingDraft ||
              isUpdatingDraft ||
              isUpdatingSchedule
            }
            onClick={handleSubmit}
          >
            {date && schedule
              ? "Update schedule"
              : date
              ? "Schedule"
              : isEditMode
              ? "Update"
              : "Post"}
          </Button>
        </div>

        {/* <div className="my-6"> */}
        <div className="overflow-y-auto my-6 max-h-[50vh]">
          {editorjsx}

          {selectedHashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedHashtags.map(({ hashtag, communityId }) => (
                <span
                  key={`${communityId}-${hashtag}`}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 border border-red-500 text-gray-800 text-sm rounded-full"
                >
                  #{hashtag}
                  <button
                    onClick={() => handleRemoveHashtag(hashtag, communityId)}
                    className="ml-1 text-orange-500 hover:text-red-700 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {/* </div> */}

          {state.showPollForm && <PollForm />}

          {mediaLocalUrls.length > 0 && (
            <MediaPreview
              uploadMedia={uploadMedia}
              mediaAttachments={mediaAttachments ?? []}
            />
          )}
          {preview && <LinkPreviewer />}

          <Modal
            isOpen={showCommuityList}
            onClose={() => setShowCommunityList(false)}
            title="Choose audience"
            className="bg-background text-foreground border"
          >
            <div className="w-full max-w-md mx-auto p-4">
              <button
                className="mb-4 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium  hover:opacity-60 transition-colors"
                onClick={handleSelectAll}
              >
                {buttonText}
              </button>

              {favLoading ? (
                <LoadingSpinner />
              ) : (
                <div className=" space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {favouriteChannelLists &&
                    favouriteChannelLists.length > 0 &&
                    favouriteChannelLists.map((community) => {
                      const isSelected = selectedHashtags.some(
                        (h) => h.communityId === community.id
                      );
                      return (
                        <div
                          key={community.id}
                          className={cn(
                            "flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors",
                            theme === "dark" ||
                              (theme === "system" && isSystemDark)
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-300"
                          )}
                          onClick={() => handleCommunityToggle(community.id)}
                        >
                          {isSelected ? (
                            <SquareCheck className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                          <Image
                            src={community.attributes.avatar_image_url}
                            alt={`${community.attributes.name} avatar`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {community.attributes.name}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </Modal>
        </div>
        <div className="flex justify-start mt-auto transform transition-all duration-300 gap-2 flex-wrap">
          <SaveAsDraftModal onConfirm={onConfirmSaveAsDraft} />
          <VisibilityDropdown disabled={isEditMode} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "flex group items-center bg-gray-600 gap-2 hover:bg-[#aac2eb] border-none"
                )}
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_POLL_FORM",
                    payload: !state.showPollForm,
                  })
                }
                disabled={!!mediaLocalUrls.length}
              >
                <ListIcon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    {
                      "text-orange-500": state.showPollForm,
                      "text-foreground group-hover:text-black":
                        !state.showPollForm,
                    },
                    theme === "dark" ||
                      (theme === "system" &&
                        isSystemDark &&
                        !state.showPollForm)
                      ? "text-foreground group-hover:text-black"
                      : "text-background"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip.poll")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <label
                htmlFor="image-upload"
                className={cn(
                  "group rounded-md flex items-center bg-gray-600 border-none max-h-full h-9",
                  {
                    "opacity-60": state.showPollForm,
                    "hover:bg-[#aac2eb]": !state.showPollForm,
                  },
                  theme === "dark" || (theme === "system" && isSystemDark)
                    ? "text-foreground"
                    : "text-background"
                )}
              >
                <input
                  type="file"
                  multiple
                  onChange={onFilesSelected}
                  disabled={state.showPollForm}
                  className="hidden"
                  id="image-upload"
                />
                <div className="flex items-center px-2">
                  <ImageIcon className="w-4 h-4 group-hover:text-black" />
                </div>
              </label>
            </TooltipTrigger>

            {state.showPollForm ? null : (
              <TooltipContent>
                <p>{t("tooltip.media")}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "group flex items-center gap-2 hover:bg-[#aac2eb] border-none",
                  theme === "dark" || (theme === "system" && isSystemDark)
                    ? "text-foreground bg-gray-600"
                    : "text-background bg-gray-600"
                )}
                onClick={() => setIsSensitive(!isSensitive)}
              >
                <IoWarningOutline
                  size={16}
                  className={cn({
                    "text-white group-hover:text-black": !isSensitive,
                    "text-yellow-500": isSensitive,
                  })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip.cw")}</p>
            </TooltipContent>
          </Tooltip>

          <Popover open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "bg-gray-600 hover:bg-[#aac2eb] hover:text-black! border-none",
                      theme === "dark" || (theme === "system" && isSystemDark)
                        ? "text-foreground"
                        : "text-background"
                    )}
                  >
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
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("tooltip.emoji")}</p>
              </TooltipContent>
            </Tooltip>
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
            onSelect={onGifvSelect}
            className={cn(
              "bg-gray-600 hover:bg-[#aac2eb]",
              theme === "dark" || (theme === "system" && isSystemDark)
                ? "text-foreground"
                : "text-background"
            )}
          />

          <LanguageModal
            open={state.showLanguageModal}
            onOpenChange={(open) =>
              dispatch({ type: "TOGGLE_LANGUAGE_MODAL", payload: open })
            }
          />
          {!hideDraft && <Drafts />}
          {!hideSchedule && (
            <>
              <div
                className={cn({
                  "text-orange-500": !!date,
                })}
              >
                <DateTimePicker
                  hideLabel
                  disablePastDates
                  value={date ?? new Date()}
                  onChange={setDate}
                />
              </div>
            </>
          )}

          <Button
            className="px-2 bg-gray-600 hover:bg-[#aac2eb] hover:text-black!"
            loading={loading || isUpdatingDraft || isCreatingDraft}
            disabled={
              isPending ||
              loading ||
              isCreatingDraft ||
              isUpdatingDraft ||
              isUpdatingSchedule
            }
            onClick={() => {
              handleSaveDraft().then(() => {
                toast.success(t("toast.saved_draft"));
                router.push("/home");
                closeModal();
              });
            }}
          >
            {t("compose.draft.save")}
          </Button>

          <div
            className={cn(
              "max-h-9 flex items-center md:ml-auto",
              longPost ? "w-10" : "w-8"
            )}
          >
            <CircularProgressbar
              className=""
              value={progressValue}
              text={remainingCount >= 0 ? remainingCount.toString() : "0"}
              styles={{
                text: {
                  fontSize: longPost ? "28px" : "35px",
                  color: "#ff6900",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeForm;
