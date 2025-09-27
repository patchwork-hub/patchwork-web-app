"use client";
import Header from "@/components/atoms/common/Header";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { FALLBACK_PREVIEW_NEWSMAST_URL } from "@/constants/url";
import { useDetailCollectionChannelList } from "@/hooks/queries/useCommunityChannels.query";
import { isValidImageUrl } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { capitalize } from "lodash";
import { ChevronRight, SearchX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function NewsmastChannelsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {t} = useLocale();
  const {
    data: collectionChannelsList,
    isLoading,
    isSuccess,
  } = useDetailCollectionChannelList({ slug, type: "newsmast" });
  const router = useRouter();

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <LayoutContainer>
      <Header
        title={`${
          slug === "all-collection" ? `${t("newsmast_channels")}` : capitalize(slug)
        }`}
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingSpinner />
        ) : Array.isArray(collectionChannelsList) ? (
          <motion.div
            key="newsmast-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 px-4 justify-start w-full max-w-full mb-auto mt-4 pb-4"
          >
            {collectionChannelsList &&
              collectionChannelsList?.map(
                (list: ChannelList, index: number) => {
                  return (
                    <motion.div
                      key={index}
                      className="relative cursor-pointer "
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      onClick={() => {
                        router.push(
                          `/newsmast/${list.attributes.slug}?slug=${
                            list.attributes.community_admin.username
                          }`
                        );
                      }}
                    >
                      <Image
                        src={
                          isValidImageUrl(list.attributes.avatar_image_url)
                            ? list.attributes.avatar_image_url
                            : FALLBACK_PREVIEW_NEWSMAST_URL
                        }
                        alt={`${list.attributes.name}`}
                        width={200}
                        height={264}
                        loading="lazy"
                        className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                      <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                        <p className="text-white flex items-center text-sm space-x-1 max-w-20">
                          {list.attributes.name}
                        </p>
                        <ChevronRight className="text-white" />
                      </div>
                    </motion.div>
                  );
                }
              )}
          </motion.div>
        ) : (
          <div className="w-full flex items-center justify-center flex-col gap-y-2 h-[calc(100vh-215px)]">
            <SearchX className="w-10 h-10" />
            <p className="text-gray-400 font-semibold">{t("common.no_results")}</p>
          </div>
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
}
