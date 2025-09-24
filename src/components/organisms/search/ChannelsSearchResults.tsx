"use client";
import { ThemeText } from "@/components/atoms/common/ThemeText";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ChannelsSearchResults({
  data,
  type,
}: {
  data: ChannelList[];
  type: "channel" | "newsmast-channel";
}) {
  const router = useRouter();

  return (
    <div className={cn(data.length > 0 ? "mt-8" : "")}>
      {data?.length > 0 && (
        <div className="mb-4 flex justify-between items-center px-4">
          <ThemeText size="lg_18" variant="textBold" className="justify-start">
            {type === "newsmast-channel" ? "Newsmast channels" : "Communities"}
          </ThemeText>
        </div>
      )}
      <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-4">
        {data.map((it, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 "
            onClick={() => {
              router.push(
                type === "newsmast-channel"
                  ? `/newsmast/${it.attributes.slug}?slug=${it.attributes.community_admin.username}`
                  : `/community/${it.attributes.domain_name}?slug=${it.attributes.slug}`
              );
            }}
          >
            <Image
              src={it.attributes.avatar_image_url}
              alt={`${it.attributes.name}`}
              width={200}
              height={264}
              loading="lazy"
              className="w-36 sm:w-40 h-38 sm:h-40 object-cover rounded-lg transition-all duration-300 ease-in-out"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
            <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
              <ThemeText className="text-white text-sm">
                {it.attributes.name}
              </ThemeText>
              <ChevronRight className="text-white w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
