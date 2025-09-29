
import InfoSection from "@/components/organisms/profile/InfoSection";
import {
  FALLBACK_PREVIEW_IMAGE_URL,
  FALLBACK_PREVIEW_NEWSMAST_URL,
} from "@/constants/url";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";
import { ChannelAbout, ChannelDetail } from "@/types/patchwork";
import { isValidImageUrl } from "@/utils";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import GoBack from "./GoBack";
import Image from "next/image";

interface NewsmastChannelDetail {
  attributes: {
    name: string;
    description?: string;
    banner_image_url?: string;
    avatar_image_url?: string;
    created_at?: string;
  };
}


type TCommunityBanner = {
  type?: string;
  channelDetail?: ChannelDetail;
  newsmastChannelDetail?: ChannelDetail;
  toggleChannel?: (isFav: boolean) => void | undefined;
  showButton?: boolean;
  joinDate?: string;
  acct?: string;
  isNewsmast?: boolean;
  showBio?: boolean;
  isChannel?: boolean;
  newsmastInstance?: ChannelAbout;
};

export default function CommunityBanner({
  type = "community",
  channelDetail,
  newsmastChannelDetail,
  toggleChannel,
  showButton = true,
  joinDate,
  acct,
  isChannel = false,
  isNewsmast = false,
  showBio = false,
  newsmastInstance,
}: TCommunityBanner) {
  const username = isChannel
    ? channelDetail?.acct.replace(/^@/, "")
    : channelDetail?.attributes?.community_admin?.username?.replace(/^@/, "");

  const accountName = newsmastInstance
    ? newsmastInstance?.contact?.account?.display_name ??
      newsmastInstance?.title
    : isNewsmast
    ? newsmastChannelDetail?.attributes.name
    : isChannel
    ? channelDetail?.display_name
    : channelDetail?.attributes?.name;
  const joinedDate = dayjs(
    newsmastInstance
      ? newsmastInstance?.contact?.account?.created_at ?? ""
      : isNewsmast
      ? joinDate
      : isChannel
      ? channelDetail?.created_at
      : channelDetail?.attributes?.created_at
  ).format("MMM YYYY");

  const { editorjsx } = useTipTapEditor({
    content: newsmastInstance
      ? newsmastInstance.description
      : newsmastChannelDetail?.attributes.description ?? "",
    editable: false,
  });

  return (
    <div>
      <div className="relative mb-16">
        <Image
          src={
            (newsmastInstance
              ? newsmastInstance.thumbnail.url
              : isNewsmast
              ? isValidImageUrl(
                  newsmastChannelDetail?.attributes.banner_image_url as string
                )
                ? newsmastChannelDetail?.attributes.banner_image_url
                : FALLBACK_PREVIEW_NEWSMAST_URL
              : isValidImageUrl(
                  isChannel
                    ? channelDetail?.header as string
                    : channelDetail?.attributes?.banner_image_url as string
                )
              ? isChannel
                ? channelDetail?.header
                : channelDetail?.attributes?.banner_image_url
              : FALLBACK_PREVIEW_IMAGE_URL) as string 
          }
          width={700}
          height={200}
          style={{
            aspectRatio: 3.35 / 1,
            objectFit: "cover",
          }}
          className="w-full"
          alt="banner image"
        />
        <div className="absolute top-4 left-4">
          <GoBack className="bg-gray-500 opacity-80 text-[#fff]" />
        </div>

        <div className="absolute z-40 translate-y-11 bottom-0 left-4 w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-md overflow-hidden border-2 border-gray-500">
          <Image
            src={
              (newsmastInstance
                ? newsmastInstance.thumbnail.url
                : isNewsmast
                ? isValidImageUrl(
                    newsmastChannelDetail?.attributes.avatar_image_url as string
                  )
                  ? newsmastChannelDetail?.attributes.avatar_image_url
                  : FALLBACK_PREVIEW_NEWSMAST_URL
                : isValidImageUrl(
                    isChannel
                      ? channelDetail?.avatar as string
                      : channelDetail?.attributes?.avatar_image_url as string
                  )
                ? isChannel
                  ? channelDetail?.avatar
                  : channelDetail?.attributes?.avatar_image_url
                : FALLBACK_PREVIEW_IMAGE_URL) as string
            }
            width={80}
            height={80}
            className="aspect-square object-cover w-full"
            alt="avatar image"
          />
        </div>
        {showButton && (
          <button
            onClick={() => toggleChannel?.(channelDetail?.attributes?.favourited as boolean)}
            className="absolute bottom-0 right-4 translate-y-12 rounded-full border text-gray-600 w-fit transition-colors duration-300 hover:opacity-70 cursor-pointer px-2 py-1"
          >
            {type === "community" && channelDetail?.attributes?.favourited ? (
              <Star className="text-white w-4" fill="white" />
            ) : (
              <Star className="text-white w-4" fill="none" />
            )}
          </button>
        )}
      </div>

      <div className="px-4">
        <InfoSection
          accountName={accountName as string}
          username={
            (newsmastInstance
              ? newsmastInstance?.contact?.account?.username
              : acct ?? username) as string
          }
          joinedDate={joinedDate}
          userBio={
            showBio
              ? isChannel
                ? channelDetail?.note
                : channelDetail?.attributes?.description
              : ""
          }
        />
      </div>
      <div className="px-4">{editorjsx}</div>
    </div>
  );
}
