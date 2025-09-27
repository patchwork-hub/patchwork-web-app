import { useLocale } from "@/providers/localeProvider";
import { FALLBACK_PREVIEW_IMAGE_URL, FALLBACK_PREVIEW_NEWSMAST_URL } from "@/constants/url";
import { formatNumber } from "@/utils/formatNumber";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ExploreCardProps {
  title: string | React.ReactNode;
  count: number;
  image: [string, string, string, string];
  type: "channel" | "newsmast" | "collection";
  onClick: () => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  count,
  image,
  type,
  onClick
}) => {
  const {t} = useLocale()
  const getValidImageUrl = (url: string) => {
  return url?.startsWith("https://") ? url : type === "channel"? FALLBACK_PREVIEW_IMAGE_URL : type === "newsmast" ? FALLBACK_PREVIEW_NEWSMAST_URL : FALLBACK_PREVIEW_IMAGE_URL;
};
  switch (type) {
    case "channel":
      return (
        <div
          className="w-full h-[173px] rounded-xl overflow-hidden relative cursor-pointer"
          onClick={onClick}
        >
          <div className="after:content-[''] after:absolute after:inset-0 after:bg-gray-900/50 after:z-10">
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[0])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[1])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[2])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[3])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 p-2 w-full flex items-start justify-between z-20">
              <div>
                <p className="text-[#fff] font-bold flex items-center text-base space-x-1">
                  {title}
                </p>
                <p className="text-gray-300 flex items-center text-sm space-x-1">
                  {count && formatNumber(count)} {t("screen.channels")}
                </p>
              </div>
              <ChevronRight className="text-[#fff]" size={20} />
            </div>
          </div>
        </div>
      );
    case "newsmast":
      return (
        <div
          className="w-full h-[173px] rounded-xl overflow-hidden relative cursor-pointer"
          onClick={onClick}
        >
          <div className="after:content-[''] after:absolute after:inset-0 after:bg-gray-900/50 after:z-10">
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[0])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[1])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[2])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[3])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 p-2 w-full flex items-start justify-between z-20">
              <div>
                <p className="text-[#fff] font-bold flex items-center text-base space-x-1">
                  {title}
                </p>
                <p className="text-gray-300 flex items-center text-sm space-x-1">
                  {count && formatNumber(count)} {t("screen.channels")}
                </p>
              </div>
              <ChevronRight className="text-[#fff]" size={20} />
            </div>
          </div>
        </div>
      );
    case "collection":
      return (
        <div
          className="w-full h-[173px] rounded-xl overflow-hidden relative cursor-pointer"
          onClick={onClick}
        >
          <div className="after:content-[''] after:absolute after:inset-0 after:bg-gray-900/50 after:z-10">
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[0])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[1])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="flex justify-start items-center">
              <Image
                src={getValidImageUrl(image[2])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
              <Image
                src={getValidImageUrl(image[3])}
                alt="title"
                width={300}
                height={300}
                className="w-1/2 h-[86px] object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 p-2 w-full flex items-start justify-between z-20">
              <div>
                <p className="text-[#fff] font-bold flex items-center text-base space-x-1">
                  {title}
                </p>
                <p className="text-gray-300 flex items-center text-sm space-x-1">
                  {count && formatNumber(count)} {t("screen.channels")}
                </p>
              </div>
              <ChevronRight className="text-[#fff]" size={20} />
            </div>
          </div>
        </div>
      );
  }
};

export default ExploreCard;
