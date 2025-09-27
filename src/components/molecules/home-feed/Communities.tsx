"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import CardSkeleton from "../skeletons/cardSkeleton";
import { useRouter } from "next/navigation";
import { ThemeText } from "../common/ThemeText";
import { formatNumber } from "@/utils/formatNumber";
import { CollectionList } from "@/types/patchwork";
import { useLocale } from "@/providers/localeProvider";

type TCollections = {
  collections: CollectionList[];
  loading?: boolean;
  hideViewAll?: boolean;
  activeTab?: string;
};

const Communities = ({
  collections,
  loading = false,
  hideViewAll = false,
  activeTab
}: TCollections) => {
  const router = useRouter();
  const {t} = useLocale()

  if (!loading && (!collections || collections.length === 0)) {
    return null;
  }
  const getValidImageUrl = (url: string) => {
    return url?.startsWith("https://") ? url : "/pwork.png";
  };

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
        {t("screen.communities")}
      </ThemeText>
      {!hideViewAll && (
        <ThemeText
          size="md_16"
          className="cursor-pointer"
          onClick={() => router.push("/communities")}
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

  const renderCollections = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      <div
        className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-4!"
        onClick={() => {
          const basePath = `/communities/${collections[0].attributes.name.toLowerCase()}?slug=${
            collections[0].attributes.slug
          }`;
          if (activeTab) {
            router.push(`${basePath}&tab=${activeTab}`);
          } else {
            router.push(basePath);
          }
        }}
        >
        <div className="w-36 sm:w-40 h-38 sm:h-40 rounded-lg overflow-hidden">
          {(() => {
            const slicedCollections = collections.slice(1, 5);
            const imageCount = slicedCollections.length;

            if (imageCount === 1) {
              return (
                <Image
                  src={getValidImageUrl(
                    slicedCollections[0].attributes.avatar_image_url
                  )}
                  alt="Single image"
                  width={100}
                  height={132}
                  className="w-full h-full object-cover"
                />
              );
            }

            if (imageCount === 2) {
              return (
                <div className="grid grid-cols-2 gap-1 h-full">
                  {slicedCollections.map((collection, i) => (
                    <Image
                      key={i}
                      src={collection.attributes.avatar_image_url}
                      alt={`Combined ${i + 1}`}
                      width={100}
                      height={132}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              );
            }

            if (imageCount === 3) {
              return (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                  <Image
                    src={getValidImageUrl(
                      slicedCollections[0].attributes.avatar_image_url
                    )}
                    alt="Combined 1"
                    width={100}
                    height={132}
                    className="w-full h-full object-cover"
                  />
                  <Image
                    src={getValidImageUrl(
                      slicedCollections[1].attributes.avatar_image_url
                    )}
                    alt="Combined 2"
                    width={100}
                    height={132}
                    className="w-full h-full object-cover"
                  />
                  <Image
                    src={getValidImageUrl(
                      slicedCollections[2].attributes.avatar_image_url
                    )}
                    alt="Combined 3"
                    width={100}
                    height={132}
                    className="w-full h-full object-cover col-span-2"
                  />
                </div>
              );
            }

            if (imageCount === 4) {
              return (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                  {slicedCollections.map((collection, i) => (
                    <Image
                      key={i}
                      src={getValidImageUrl(
                        collection.attributes.avatar_image_url
                      )}
                      alt={`Combined ${i + 1}`}
                      width={100}
                      height={132}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              );
            }

            return null;
          })()}
        </div>
        <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
        <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
          <ThemeText className="text-[#fff] text-sm space-x-1">
            {collections[0]?.attributes.name}
            {collections[0].attributes?.community_count &&
              `(${formatNumber(collections[0].attributes?.community_count)})`}
          </ThemeText>
          <ChevronRight className="text-[#fff] w-4" />
        </div>
      </div>

      {collections.slice(1).map((collection, index) => (
        <div
          onClick={() =>
            router.push(
              `/communities/${collection.attributes.name.toLowerCase()}?slug=${
                collection.attributes.slug
              }`
            )
          }
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            index === collections.length - 2 ? "mr-4" : ""
          }`}
        >
          <Image
            src={getValidImageUrl(collection.attributes.avatar_image_url)}
            alt={`${collection.attributes.name}`}
            width={200}
            height={264}
            loading="lazy"
            className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
          />
          <div className="absolute top-0 left-0 w-36 sm:w-40 h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
            <ThemeText className="text-[#fff] text-sm space-x-1">
              {collection.attributes.name}
              {`(${formatNumber(collection.attributes?.community_count)})`}
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
      {loading ? renderLoadingState() : renderCollections()}
    </div>
  );
};

export default Communities;
