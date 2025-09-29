"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import { useLocale } from "@/providers/localeProvider";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { useGetChannelFeedListQuery } from "@/hooks/queries/useChannelList.query";
import { isValidImageUrl } from "@/utils";
import { cleanDomain, ensureHttp, formatSlug } from "@/utils/helper/helper";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import { ChannelList } from "@/types/patchwork";

export default function ChannelsLists() {
  const { userOriginInstance, userInfo } = useAuthStore();
  const {t} = useLocale();
  const router = useRouter();
  const { data: serverInfo } = useSearchServerInstance(
    {
      domain: userOriginInstance,
      enabled: true,
    }
  );

  const { data: channelFeedList, isLoading: channelFeedLoading } =
    useGetChannelFeedListQuery({
      enabled: true,
    });
  const imageUrl = serverInfo?.thumbnail?.url ?? FALLBACK_PREVIEW_IMAGE_URL;
  const validUrl = ensureHttp(imageUrl) ? imageUrl : FALLBACK_PREVIEW_IMAGE_URL;

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const handleChannelClick = (channel: ChannelList) => {
    const userId = channel.attributes.community_admin.account_id;

    if (userId == userInfo?.id) {
      return router.push(`/@${userInfo?.acct}`);
    } else {
      return router.push(`/channels/${formatSlug(channel.attributes.slug)}`);
    }
  };

  return (
    <>
      <Header title= {t("screen.channels")} />
      <AnimatePresence mode="wait">
        {channelFeedLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            key="channels-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 px-4 justify-start w-full max-w-full mb-auto mt-4 pb-20 sm:pb-4"
          >
            <div
              onClick={() => {
                router.push(`/community/${cleanDomain(userOriginInstance)}`);
              }}
              className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src={validUrl}
                alt="Special Channel"
                width={200}
                height={264}
                loading="lazy"
                className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
              <div className="absolute bottom-0 left-0 p-2 flex items-center justify-between w-full">
                <ThemeText className="text-[#fff] text-sm ">
                  {serverInfo?.title}
                </ThemeText>
                <ChevronRight className="text-[#fff] w-4" />
              </div>
            </div>
            {channelFeedList?.map((list, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() => {
                  handleChannelClick(list);
                }}
              >
                <Image
                  src={
                    // "/pwork.png"
                    isValidImageUrl(list.attributes.avatar_image_url)
                      ? list.attributes.avatar_image_url
                      : FALLBACK_PREVIEW_IMAGE_URL
                  }
                  alt={`${list.attributes.name}`}
                  width={200}
                  height={264}
                  loading="lazy"
                  className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                />

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                  <ThemeText className="text-[#fff] text-sm sm:text-lg">
                    {list.attributes.name}
                  </ThemeText>
                  <ChevronRight className="text-[#fff]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
