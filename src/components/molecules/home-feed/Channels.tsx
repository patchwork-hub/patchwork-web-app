"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import CardSkeleton from "../skeletons/cardSkeleton";

import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { Instance_V2 } from "@/types/auth";
import { isValidImageUrl } from "@/utils";
import { cleanDomain, ensureHttp, formatSlug } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { DEFAULT_API_URL } from "@/utils/constant";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { ThemeText } from "../common/ThemeText";
import { ChannelList } from "@/types/patchwork";
import { useLocale } from "@/providers/localeProvider";

type TChannels = {
  lists: ChannelList[];
  loading?: boolean;
  serverInfo: Instance_V2;
  hideViewAll?: boolean;
  activeTab?: string;
  hideSpecialCard?: boolean;
};

const Channels = ({
  lists,
  loading = false,
  serverInfo,
  hideViewAll = false,
  activeTab,
  hideSpecialCard = false,
}: TChannels) => {
  const router = useRouter();
  const {t} = useLocale()
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { data: userInfo } = useVerifyAuthToken({ enabled: true });

  if (!loading && (!lists || lists.length === 0)) {
    return null;
  }

  const handleChannelClick = (channel: ChannelList) => {
    const userId = channel.attributes.community_admin.account_id;
    if (userId == userInfo?.id) {
      return activeTab
        ? router.push(`/@${userInfo?.acct}?tab=${activeTab}`)
        : router.push(`/@${userInfo?.acct}`);
    } else {
      const slug =
        channel.attributes.slug === "echo-bytes"
          ? "techoecho"
          : formatSlug(channel.attributes.slug);
      return activeTab
        ? router.push(`/channels/${slug}?tab=${activeTab}`)
        : router.push(`/channels/${slug}`);
    }
  };

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
         {t("screen.channels")}
      </ThemeText>
      {!hideViewAll && (
        <ThemeText
          size="md_16"
          className="cursor-pointer"
          onClick={() => router.push("/channels")}
        >
          {t("common.view_all")}
        </ThemeText>
      )}
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 ${index === 0 ? "ml-4!" : ""} ${
            index === 2 ? "mr-4" : ""
          }`}
        >
          <CardSkeleton />
        </div>
      ))}
    </div>
  );

  const showSpecialCard =
    domain && serverInfo && typeof serverInfo !== "string";
  const sliceLimit = showSpecialCard ? 9 : 10;
  const renderSpecialCard = () => {
    const serverInfoTyped = serverInfo as Instance_V2;

    return (
      <div
        onClick={() => {
          router.push(`/community/${cleanDomain(domain)}`);
        }}
        className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-4!"
      >
        <Image
          src={
            ensureHttp(serverInfoTyped.thumbnail.url)
              ? serverInfoTyped.thumbnail.url
              : "/pwork.png"
          }
          alt="Special Channel"
          width={200}
          height={264}
          loading="lazy"
          className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
        />
        <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg" />
        <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
          <ThemeText className="text-[#fff] text-sm ">
            {serverInfoTyped.title}
          </ThemeText>
          <ChevronRight className="text-[#fff] w-4" />
        </div>
      </div>
    );
  };

  const renderChannels = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {showSpecialCard && renderSpecialCard()}
      {lists.slice(0, sliceLimit).map((channel, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            index === 0 && (!showSpecialCard || hideSpecialCard)? "ml-4!" : ""
          } ${index === sliceLimit - 1 ? "mr-4" : ""}`}
          onClick={() => {
            handleChannelClick(channel);
          }}
        >
          <Image
            src={
              isValidImageUrl(channel.attributes.avatar_image_url)
                ? channel.attributes.avatar_image_url
                : FALLBACK_PREVIEW_IMAGE_URL
            }
            alt={`${channel.attributes.name}`}
            width={200}
            height={264}
            loading="lazy"
            className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
          />
          <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
            <ThemeText className="text-[#fff] text-sm ">
              {channel.attributes.name}
            </ThemeText>
            <ChevronRight className="text-[#fff] w-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      {renderHeader()}
      {loading ? renderLoadingState() : renderChannels()}
    </div>
  );
};

export default Channels;
