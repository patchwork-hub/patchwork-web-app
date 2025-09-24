"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import CardSkeleton from "../skeletons/cardSkeleton";
import { useRouter } from "next/navigation";
import { isValidImageUrl } from "@/utils";
import { FALLBACK_PREVIEW_NEWSMAST_URL } from "@/constants/url";
import { useLocale } from "../providers/localeProvider";
import { ThemeText } from "../common/ThemeText";
import { formatNumber } from "@/utils/formatNumber";

type TNewsmastChannel = {
  lists: CollectionList[];
  loading?: boolean;
  hideViewAll?: boolean;
  activeTab?: string;
};

const NewsmastChannels = ({
  lists,
  loading = false,
  hideViewAll = false,
  activeTab,
}: TNewsmastChannel) => { 

  if (!loading && (!lists || lists.length === 0)) {
    return null;
  }

  const {t} = useLocale()

  const router = useRouter();
  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
         {t("screen.newsmast_channels")}
      </ThemeText>
      {!hideViewAll && (
        <ThemeText
          size="md_16"
          className="cursor-pointer"
          onClick={() => router.push("/newsmast")}
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
      {lists?.slice(0, 10).map((newsmast, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            index === 0 ? "ml-4!" : ""
          } ${index === 9 ? "mr-4" : ""}`}
          onClick={() =>
            activeTab
              ? router.push(
                  `/newsmast-channel/${newsmast.attributes.slug}?tab=${activeTab}`
                )
              : router.push(`/newsmast-channel/${newsmast.attributes.slug}`)
          }
        >
          <Image
            src={
              isValidImageUrl(newsmast.attributes.avatar_image_url)
                ? newsmast.attributes.avatar_image_url
                : FALLBACK_PREVIEW_NEWSMAST_URL
            }
            alt={`${newsmast.attributes.name}`}
            width={200}
            height={264}
            loading="lazy"
            className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
          />
          <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
            <p className="text-[#fff] flex items-center text-sm space-x-1 max-w-20">
              {newsmast.attributes.name}{" "}
              {newsmast.attributes?.community_count &&
                `(${formatNumber(newsmast.attributes?.community_count)})`}
            </p>
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

export default NewsmastChannels;
