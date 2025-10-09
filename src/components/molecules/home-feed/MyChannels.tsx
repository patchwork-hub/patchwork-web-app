"use client";

import { FALLBACK_MOME_IMAGE_URL } from "@/constants/url";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn } from "@/lib/utils";
import { isValidImageUrl } from "@/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CardSkeleton from "../skeletons/cardSkeleton";
import { PrimaryIcon } from "@/components/atoms/icons/Icons";
import { cleanDomain } from "@/utils/helper/helper";
import React from "react";
import { useLocale } from "@/providers/localeProvider";
import { useSelectedDomain } from "@/stores/auth/activeDomain";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import { ThemeText } from "../common/ThemeText";
import { ChannelList, MyChannel } from "@/types/patchwork";

type TMyChannels = {
  myChannels?: MyChannel;
  favList?: ChannelList[];
  loading?: boolean;
};

const MyChannels = ({
  myChannels,
  favList = [],
  loading = false,
}: TMyChannels) => {
  const { data: currentAccount } = useVerifyAuthToken({ enabled: true });
  const domain_name = useSelectedDomain();
  const { data: serverInfo } = useSearchServerInstance(
    {
      domain: domain_name,
    }
  );
  const {t} = useLocale();
  const router = useRouter();

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="xl_20" variant="textBold" className="justify-start">
        {t("screen.for_you")}
      </ThemeText>
      <ThemeText
        size="md_16"
        className="cursor-pointer"
        onClick={() => router.push("/my-channels")}
      >
         {t("common.view_all")}
      </ThemeText>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 ${index === 0 ? "ml-4" : ""} ${
            index === 2 ? "mr-4" : ""
          }`}
        >
          <CardSkeleton />
        </div>
      ))}
    </div>
  );

  const renderChannels = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {myChannels && Object.keys(myChannels.channel_feed).length > 0 && (
        <div
          className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-4!"
          onClick={() => {
            router.push(`/@${currentAccount?.acct}`);
          }}
        >
          <Image
            src={
              isValidImageUrl(
                myChannels.channel_feed.data.attributes.avatar_image_url
              )
                ? myChannels.channel_feed.data.attributes.avatar_image_url
                : FALLBACK_MOME_IMAGE_URL
            }
            alt="channel image"
            width={200}
            height={264}
            loading="lazy"
            className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
          />
          <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
            <ThemeText className="text-[#fff] text-sm">
              {myChannels.channel_feed.data.attributes.display_name}
            </ThemeText>
            <ChevronRight className="text-[#fff] w-4" />
          </div>
        </div>
      )}

      {serverInfo && (
        <div
          className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-4!"
          onClick={() =>
            router.push(`/community/${cleanDomain(domain_name)}`)
          }
        >
          <Image
            src={serverInfo?.thumbnail?.url ?? FALLBACK_MOME_IMAGE_URL}
            alt={`instance image`}
            width={200}
            height={264}
            loading="lazy"
            className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
          />
          <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
            <ThemeText className="text-[#fff] text-sm">
              {serverInfo?.title}
            </ThemeText>
            <ChevronRight className="text-[#fff] w-4" />
          </div>
        </div>
      )}

      {favList.map((fav, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300",
              {
                "mr-4": index === favList.length - 1
              }
            )}
            onClick={() => {
              router.push(
                ` /newsmast/${fav.attributes.slug}?slug=${
                  fav.attributes.community_admin.username
                }`
              );
            }}
          >
            <Image
              src={fav.attributes.avatar_image_url ?? FALLBACK_MOME_IMAGE_URL}
              alt={`${fav.attributes.name} image`}
              width={200}
              height={264}
              loading="lazy"
              className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
            />
            {fav.attributes.is_primary && (
              <PrimaryIcon className="min-w-5 min-h-5 absolute top-1 right-1" />
            )}
            <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
            <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
              <ThemeText className="text-[#fff] text-sm">
                {fav.attributes.name}
              </ThemeText>
              <ChevronRight className="text-[#fff] w-4" />
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  if (!loading && !myChannels && (!favList || favList.length === 0)) {
    return null;
  }

  return (
    <div className="">
      {renderHeader()}
      {loading ? renderLoadingState() : renderChannels()}
    </div>
  );
};

export default MyChannels;
