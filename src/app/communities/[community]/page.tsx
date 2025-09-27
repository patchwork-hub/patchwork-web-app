"use client";
import Header from "@/components/atoms/common/Header";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import { use } from "react";
import { useDetailCollectionChannelList } from "@/hooks/queries/useCommunityChannels.query";
import { useLocale } from "@/components/molecules/providers/localeProvider";

export default function Communities({
  params
}: {
  params: Promise<{ community: string }>;
}) {
  const { community } = use(params);
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const tab = searchParams.get("tab");
  const {
    data: collectionChannelsList,
    isLoading,
  } = useDetailCollectionChannelList({ slug });

  const router = useRouter();
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <LayoutContainer>
      <Header
        title={t(`timeline.communities`)}
        backRoute={`/search?tab=${tab}`}
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            key="communities-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 px-4 pb-4 justify-start w-full max-w-full mb-auto mt-4"
          >
            {collectionChannelsList?.data.map((collection, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer hover:opacity-80 transition-opacity duration-300"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() => {
                  router.push(
                    `/community/${collection.attributes.domain_name}?slug=${collection.attributes.slug}`
                  );
                }}
              >
                <Image
                  src={collection.attributes.avatar_image_url}
                  alt={`${collection.attributes.name}`}
                  width={200}
                  height={264}
                  loading="lazy"
                  className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                  <ThemeText className="text-[#fff] text-sm sm:text-lg">
                    {collection.attributes.name}
                  </ThemeText>
                  <ChevronRight className="text-[#fff]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
}
