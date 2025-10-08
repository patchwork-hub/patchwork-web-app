"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { FALLBACK_MOME_IMAGE_URL } from "@/constants/url";
import { useFavouriteChannelLists } from "@/hooks/queries/useFavouriteChannelList.query";
import { DEFAULT_API_URL } from "@/utils/constant";
import { cleanDomain, formatSlug } from "@/utils/helper/helper";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useLocale } from "@/providers/localeProvider";
import { useAuthStore } from "@/stores/auth/authStore";
import { useSelectedDomain } from "@/stores/auth/activeDomain";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";

export default function MyChannelsPage() {
  const { userOriginInstance } = useAuthStore();
  const {t} = useLocale();
  const router = useRouter();
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;

  const { data: favouriteChannelLists, isLoading: favLoading } =
    useFavouriteChannelLists({
      enabled: userOriginInstance === DEFAULT_API_URL,
      instance_domain: domain,
      platform_type: "newsmast.social",
    });

  const domain_name = useSelectedDomain();
  const { data: serverInfo } = useSearchServerInstance(
    {
      domain: domain_name,
    }
  );
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <LayoutContainer>
      <Header title={t("screen.for_you")} />
      <AnimatePresence mode="wait">
        {favLoading || !Array.isArray(favouriteChannelLists) ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 w-full h-auto">
            {serverInfo && (
              <motion.div
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="relative cursor-pointer w-full max-w-full h-fit"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
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
                  className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                />
                <div className="absolute top-0 left-0 w-full h-38 sm:h-56 bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                  <ThemeText className="text-white text-sm sm:text-lg">
                    {serverInfo?.title}
                  </ThemeText>
                  <ChevronRight className="text-white" />
                </div>
              </motion.div>
            )}
            {favouriteChannelLists?.map((list, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="relative cursor-pointer w-full max-w-full h-fit"
                custom={index}
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() => {
                  router.push(
                    ` /newsmast/${formatSlug(list.attributes.slug)}?slug=${
                      list.attributes.community_admin.username
                    }`
                  );
                }}
              >
                <Image
                  src={
                    list.attributes.avatar_image_url ?? FALLBACK_MOME_IMAGE_URL
                  }
                  alt={`${list.attributes.name}`}
                  width={200}
                  height={264}
                  loading="lazy"
                  className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                />
                <div className="absolute top-0 left-0 w-full h-38 sm:h-56 bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                  <ThemeText className="text-white text-sm sm:text-lg">
                    {list.attributes.name}
                  </ThemeText>
                  <ChevronRight className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
}
