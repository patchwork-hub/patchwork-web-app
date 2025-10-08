import React, { useState } from "react";
import { Status as StatusType } from "../../../types/status";
import { LinkPreview } from "../compose/tools/LinkPreview";
import Poll from "../poll/Poll";
import { StatusActions } from "./StatusActions";
import TimeAgo from "@/utils/helper/timeAgo";
import { ProfileNameRedMark } from "@/components/atoms/icons/Icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaAttachmentPreview from "./MediaAttachmentPreview";
import TagBar from "./TagBar";
import { useTranslate } from "@/hooks/queries/translate/translate";
import { languages } from "@/constants/languages";
import { AtSign, Repeat } from "lucide-react";
import { visibilityIcons } from "../compose/tools/VisibilityDropdown";
import { useTheme } from "next-themes";
import { cleanDomain, isSystemDark } from "@/utils/helper/helper";
import { DEFAULT_API_URL } from "@/utils/constant";
import { DisplayName } from "@/components/molecules/common/DisplayName";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import Image from "next/image";
import { MastodonCustomEmoji } from "../compose/tools/Emoji";

type StatusProps = {
  status: StatusType;
  reblog?: boolean;
  ownStatus?: boolean;
  preview?: boolean;
  detail?: boolean;
  direct?: boolean;
  centerInnerStatus?: boolean;
  className?: string;
  showEdit?: boolean;
  thread?: boolean;
  domain?: string;
};
const formatAcct = (acct: string): string => {
  const domain = cleanDomain(DEFAULT_API_URL);
  if (!acct.includes("@")) {
    return `${acct}@${domain}`;
  }
  return acct;
};
const Status: React.FC<StatusProps> = ({
  status,
  reblog = false,
  ownStatus = false,
  preview = false,
  detail = false,
  direct = false,
  centerInnerStatus = false,
  className,
  showEdit = false,
  thread = false,
  domain,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [statusToTranslate, setStatusToTranslate] = useState<StatusType>();
  const { data: translationResult, isFetching: translateLoading } =
    useTranslate(statusToTranslate?.id);
  const data = status.reblog ?? status;

  const handleGoToDetail = () => {
    if (domain) {
      if (!detail) {
        router.push(`/@${data.account.acct}/${status.id}?domain=${domain}`);
      }
    } else {
      if (!detail) {
        router.push(`/@${data.account.acct}/${status.id}`);
      }
    }
  };

  const handleTranslate = () => {
    setStatusToTranslate(status);
  };

  type TiptapClickEvent = React.MouseEvent<Element, MouseEvent>;

  const handleClick = (e: TiptapClickEvent) => {
    const targetElement = e.target as HTMLElement;
    if (
      targetElement.tagName === "A" ||
      window.getSelection()?.toString() !== ""
    ) {
      return;
    }
    handleGoToDetail();
  };
  const parseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.body.children);
  };

  const processLastParagraph = (p: Element) => {
    const fragment = document.createDocumentFragment();

    Array.from(p.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE || node.nodeName === "BR") {
        fragment.appendChild(node.cloneNode(true));
      }
    });

    const tempDiv = document.createElement("div");
    tempDiv.appendChild(fragment);
    return tempDiv.innerHTML;
  };
  const contentParagraphs = parseContent(data?.content ?? "");
  const hasMultipleParagraphs = contentParagraphs.length > 1;

  const mainContent = hasMultipleParagraphs
    ? [
        ...contentParagraphs.slice(0, -1).map((p) => p.outerHTML),
        processLastParagraph(contentParagraphs[contentParagraphs.length - 1]),
      ].join("")
    : contentParagraphs[0]?.outerHTML || data?.content || "";

  const tagbarContent = hasMultipleParagraphs
    ? (() => {
        for (let i = contentParagraphs.length - 1; i >= 0; i--) {
          const p = contentParagraphs[i];
          if (p.querySelector("a.mention.hashtag")) {
            return p.outerHTML;
          }
        }
        return "";
      })()
    : "";

  // Modified editor content
  const { editorjsx } = useTipTapEditor({
    content: translationResult?.content
      ? translationResult?.content
      : data?.content ?? mainContent,
    editable: false,
    emojis: data?.emojis as MastodonCustomEmoji[],
    className: cn("mb-2 max-w-full overflow-hidden px-4", {
      "ml-12": !preview && !detail,
    }),
    onClick: handleClick,
  });
  const { fields } = data.account;

  const isAccVerified = fields && fields.some((field) => !!field.verified_at);

  const VisiblityIcon = visibilityIcons[data.visibility];

  return (
    <div
      className={cn(
        "group text-start grid border-t-[0.5px] py-4 relative",
        {
          "border-[0.5px] border-gray-600 rounded-lg": reblog || preview,
          "ml-16 mr-4": reblog && !centerInnerStatus,
          "mx-4": centerInnerStatus,
          "border-t-[0.5px] py-4": detail,
          "before:content-[''] before:h-full before:w-[0.5px] before:bg-gray-200 before:absolute before:top-0 before:left-[33px]":
            thread,
        },
        theme === "dark" || (theme === "system" && isSystemDark)
          ? "border-t-gray-600"
          : "border-t-gray-600",
        className
      )}
    >
      {status.reblog ? (
        <h1 className="flex gap-2 items-center px-4 mb-2 text-gray-400">
          <Repeat className="w-4 h-4" />{" "}
          <DisplayName
            emojis={
              (status.account.emojis as MastodonCustomEmoji[]) ||
              (status.reblog.account.emojis as MastodonCustomEmoji[])
            }
            acct={status.account.acct}
            displayName={status.account.display_name || status.account.username}
            className="inline text-lilac"
          />{" "}
          boosted
        </h1>
      ) : data?.visibility === "direct" && direct ? (
        <h1 className="flex gap-2 items-center px-4 mb-2 text-orange-500">
          <AtSign size={20} /> Private mention
        </h1>
      ) : null}
      <div className="flex">
        <Link
          href={`/@${data.account.acct}`}
          className="w-full flex items-center mb-2 px-4 gap-4"
        >
          <div className="relative">
            <Image
              src={data.account.avatar}
              alt="avatar photo"
              width={40}
              height={40}
              className="w-10 aspect-square rounded-full bg-background"
            />
            {status.reblog && (
              <Image
                className="w-6 aspect-square rounded-full absolute bottom-0 end-0 translate-2"
                src={status?.account?.avatar}
                alt="avatar photo"
                width={24}
                height={24}
              />
            )}
          </div>
          <div className="w-full flex flex-col">
            <div className="flex items-center">
              <strong className="flex items-center text-sm font-semibold">
                <DisplayName
                  notLink
                  emojis={data.account.emojis as MastodonCustomEmoji[]}
                  acct={data.account.acct}
                  displayName={
                    data.account.display_name || data.account.username
                  }
                />
                {isAccVerified && (
                  <ProfileNameRedMark
                    style={{ flexShrink: 0 }}
                    className="ml-2"
                  />
                )}
              </strong>
              <div className="ms-auto flex gap-1 items-center text-gray-400 text-xs">
                <VisiblityIcon className="w-4 h-4 text-foreground" />
                <TimeAgo timestamp={data.created_at} className="text-lilac" />
              </div>
            </div>
            <span className="text-xs text-lilac">
              @{formatAcct(data.account.acct)}
            </span>
          </div>
        </Link>
        <div className="grow flex cursor-pointer" onClick={handleClick}></div>
      </div>
      {mainContent && (
        <>
          {editorjsx}
          <div className="group-has-[.read-more]:hidden">
            {statusToTranslate && (
              <div className="ml-12 flex gap-2 mb-2 px-4">
                {translateLoading ? (
                  <div className="text-gray-400 flex items-center gap-2">
                    <span>Translating...</span>
                    <LoadingSpinner className="w-3 h-3 border-1" />
                  </div>
                ) : translationResult ? (
                  <>
                    <p className="text-gray-400">
                      Translated from{" "}
                      {languages[translationResult.detected_source_language]}{" "}
                      using {translationResult.provider}
                    </p>
                    <button
                      onClick={() => setStatusToTranslate(undefined)}
                      className="text-orange-500 ms-auto cursor-pointer"
                    >
                      Show original
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
      <div
        className={cn("grid gap-1 rounded-md overflow-hidden px-4 relative", {
          "grid-cols-1": data?.media_attachments?.length === 1,
          "grid-cols-2": data?.media_attachments?.length > 1,
          "ml-12": !preview && !detail,
        })}
      >
        {data &&
          data?.media_attachments?.map((media, idx) => (
            <MediaAttachmentPreview
              className={cn({
                "row-span-2":
                  (data.media_attachments.length === 3 && idx === 0) ||
                  data.media_attachments.length === 2,
                "aspect-video":
                  (data.media_attachments.length === 3 && idx !== 0) ||
                  data.media_attachments.length !== 2,
                "h-full":
                  (data.media_attachments.length === 3 && idx === 0) ||
                  data.media_attachments.length === 2,
                "max-h-[350px]":
                  !(data.media_attachments.length === 3 && idx === 0) &&
                  data.media_attachments.length !== 2,
                "h-[350px]": data.media_attachments.length === 2,
              })}
              key={media.id}
              media={media}
              sensitive={data.sensitive}
            />
          ))}
      </div>
      {data?.media_attachments?.length === 0 && data.card && (
        <div
          className={cn("px-4", {
            "ml-12": !preview && !detail,
          })}
        >
          <LinkPreview
            title={data.card.title}
            description={data.card.description}
            url={data.card.url}
            image={data.card.image}
          />
        </div>
      )}
      {data.poll && (
        <div
          className={cn("px-4", {
            "ml-12": !preview && !detail,
          })}
        >
          <Poll poll={data.poll} />
        </div>
      )}

      {hasMultipleParagraphs && (
        <TagBar content={tagbarContent} marginLeft={!preview && !detail} />
      )}

      {!reblog && !preview && (
        <div
          className={cn("ps-4 pe-4 mt-4", {
            "border-t-[0.5px] border-gray-600 pt-4": detail,
            "ps-16": !detail,
          })}
        >
          <StatusActions
            ownStatus={ownStatus}
            deleteId={status.id}
            editId={status.id}
            status={data}
            showEdit={showEdit}
            handleTranslate={handleTranslate}
          />
        </div>
      )}
    </div>
  );
};

export default Status;
