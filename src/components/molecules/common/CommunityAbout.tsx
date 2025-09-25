"use client";

import React from "react";
import dayjs from "dayjs";
import { ThemeText } from "./ThemeText";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommunityAccountResponse,
  HashtagTimelineResponse,
} from "@/types/community";
import { isSystemDark } from "@/utils/helper/helper";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";

type ChannelAdditionalInfo = {
  content: string;
};

type Props = {
  channelAbout?: ChannelAbout | undefined;
  channelAdditionalInfo?: ChannelAdditionalInfo;
  channelDetail?: ChannelList | undefined;
  isCommunity?: boolean;
  communityHashtag?: HashtagTimelineResponse;
  suggestedPeople?: CommunityAccountResponse;
  relationships?: unknown;
  createdAt?: string;
  onRefetch?: () => void;
  querySlug?: string;
};

const CommunityAbout: React.FC<Props> = ({
  channelAbout,
  channelAdditionalInfo,
  channelDetail,
  isCommunity = false,
  communityHashtag,
  suggestedPeople,
  createdAt,
  querySlug,
}) => {
  const { editorjsx } = useTipTapEditor({
    content: isCommunity
      ? channelAbout?.note
      : channelAdditionalInfo?.content ||
        channelDetail?.attributes?.description,
    editable: false,
    hashtagClassName: "text-orange-500",
  });
  const router = useRouter();
  const { t } = useLocale();

  const createdDate = dayjs(createdAt).format("YYYY-MM-DD");
  const { theme } = useTheme();
  const orangeTextComponent = (chunks: React.ReactNode) => (
    <span key="orange-highlight" className="text-orange-500">
      {chunks}
    </span>
  );
  return (
    <div className="px-4">
      {(channelAdditionalInfo?.content ||
        channelDetail?.attributes?.description) && (
        <p className="text-start font-bold text-[15px] my-4">
          {t("channel.channel_information")}
        </p>
      )}

      {isCommunity && channelAbout !== undefined && (
        <div className="border-b border-b-gray-600">
          <p className="text-start font-bold text-[15px] my-4">
            {t("channel.about_this_community")}
          </p>
        </div>
      )}

      <div className="mb-2 max-w-full overflow-hidden">{editorjsx}</div>

      {channelDetail?.attributes?.community_admin?.username && (
        <>
          <div className="flex items-center space-x-2 mt-4">
            <CalendarIcon className="w-5 h-5" />
            <p className="ml-2">Created at {createdDate} by</p>
            <p
              className="text-orange-500 cursor-pointer"
              onClick={() =>
                router.push(
                  `/${channelDetail?.attributes?.community_admin?.username}`
                )
              }
            >
              {channelDetail?.attributes?.community_admin?.username}
            </p>
          </div>
          <div className="border-b border-b-gray-600 pb-2"></div>
        </>
      )}

      {isCommunity && communityHashtag && communityHashtag?.data.length > 0 && (
        <div className="border-b border-b-gray-600 py-4">
          <div className="flex items-center justify-between">
            <p className="text-start font-bold text-[15px]">
              {t("channel.community_hashtags")}
            </p>
            <button
              className="text-orange-500 cursor-pointer"
              type="button"
              onClick={() =>
                router.push(`${window.location.pathname}/hashtags`)
              }
            >
              {t("common.see_more")}
            </button>
          </div>
          <div>
            {communityHashtag?.data?.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer flex items-center justify-between py-2 ${
                  index === 4 ? "" : " border-b border-b-gray-600"
                }`}
                onClick={() => router.push(`/hashtags/${item.name}`)}
              >
                <div className="">
                  <p className="text-start">#{item.name}</p>
                </div>
                <ChevronRightIcon />
              </div>
            ))}
          </div>
        </div>
      )}
      {isCommunity && querySlug && (
        <div className="border-b border-b-gray-600 py-4">
          <p className="text-start font-bold text-[15px] mb-4">
            {t("channel.follow_us")}
          </p>
          <p>
            {t("channel.follow_bot_instruction", {
              botAccount: querySlug,
              components: {
                orangeText: orangeTextComponent,
              },
            })}
          </p>

          <p>{t("common.see_more")}</p>
        </div>
      )}
      {isCommunity && channelAbout && channelAbout?.guides?.length > 0 && (
        <div className="border-b border-b-gray-600 py-4">
          <p className="text-start font-bold text-[15px] mb-4">
            {t("channel.community_guidelines")}
          </p>
          <div className="flex flex-col space-y-2">
            {channelAbout?.guides?.map(
              (item: { title: string; description: string }, index: number) => (
                <div
                  key={index}
                  className="flex items-start flex-col space-y-2"
                >
                  <span className="font-bold">{item.title}</span>
                  <ThemeText>{item.description}</ThemeText>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {isCommunity &&
        Array.isArray(suggestedPeople?.contributors) &&
        suggestedPeople.contributors.length > 0 && (
          <div className="border-b border-y-gray-600 py-4">
            <div className="flex items-center justify-between pb-4">
              <p className="text-start font-bold text-[15px]">
                {t("common.people_to_follow")}
              </p>
              <button
                className="text-orange-500 cursor-pointer"
                type="button"
                onClick={() =>
                  router.push(`${window.location.pathname}/contributors`)
                }
              >
                {t("common.see_more")}
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              {suggestedPeople?.contributors
                ?.slice(0, 10)
                .map((account, index) => {
                  const { editorjsx: nameEditor } = useTipTapEditor({
                    editable: false,
                    className: "text-center",
                    content:
                      account.attributes.display_name ||
                      account.attributes.username,
                  });

                  return (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                        index === 0 ? "ml-4" : ""
                      } ${index === 9 ? "mr-4" : ""}`}
                    >
                      <Image
                        src={
                          account?.attributes.avatar_url ??
                          FALLBACK_PREVIEW_IMAGE_URL
                        }
                        alt={`${account?.attributes?.username} image`}
                        onClick={() =>
                          router.push(`/${account?.attributes?.acct}`)
                        }
                        width={200}
                        height={200}
                        loading="lazy"
                        className="w-32 sm:w-30 h-32 sm:h-30 object-cover rounded-full transition-all duration-300 ease-in-out"
                      />
                      <div
                        onClick={() =>
                          router.push(`/${account?.attributes?.acct}`)
                        }
                        className="absolute top-0 left-0 w-32 sm:w-30 h-32 sm:h-30 bg-gradient-to-b from-transparent to-black/70 rounded-full transition-all duration-300 ease-in-out"
                      />
                      <div
                        className={cn(
                          "text-center mt-2",
                          theme === "dark" ||
                            (theme === "system" && isSystemDark)
                            ? "text-white"
                            : "text-black"
                        )}
                        onClick={() =>
                          router.push(`/${account?.attributes?.acct}`)
                        }
                      >
                        {nameEditor}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
    </div>
  );
};

export default CommunityAbout;
