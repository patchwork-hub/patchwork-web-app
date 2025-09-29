"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import { useLocale } from "@/providers/localeProvider";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Communities() {
  const { data: collections, isLoading: collectionLoading } =
    useCollectionChannelList();
  const router = useRouter();
  const {t} = useLocale();

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <LayoutContainer>
      <Header title= {t("timeline.communities")} />
      <AnimatePresence mode="wait">
        {collectionLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            key="communities-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 px-4 justify-start w-full max-w-full mb-auto mt-4 pb-20 sm:pb-4"
          >
            <motion.div
              className="relative cursor-pointer hover:opacity-80 transition-opacity duration-300"
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              onClick={() =>
                router.push(
                  `/communities/${collections?.[0].attributes.name.toLowerCase()}?slug=${
                    collections?.[0].attributes.slug
                  }`
                )
              }
            >
              <div className="w-full h-38 sm:h-56 grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden">
                {collections?.slice(1, 5).map((collection, i) => (
                  <Image
                    key={i}
                    src={
                      collection.attributes.avatar_image_url.startsWith(
                        "https://"
                      )
                        ? collection.attributes.avatar_image_url
                        : "/pwork.png"
                    }
                    alt={`Combined ${i + 1}`}
                    width={100}
                    height={132}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
              <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                <ThemeText className="text-[#fff] text-sm sm:text-lg space-x-1">
                  {collections?.[0]?.attributes.name}
                  {`(${collections?.[0].attributes?.community_count})`}
                </ThemeText>
                <ChevronRight className="text-[#fff]" />
              </div>
            </motion.div>

            {collections?.slice(1).map((collection, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer hover:opacity-80 transition-opacity duration-300"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() =>
                  router.push(
                    `/communities/${collection.attributes.name.toLowerCase()}?slug=${
                      collection.attributes.slug
                    }`
                  )
                }
              >
                <Image
                  src={
                    collection?.attributes?.avatar_image_url.startsWith(
                      "https://"
                    )
                      ? collection.attributes.avatar_image_url
                      : "/pwork.png"
                  }
                  alt={`${collection.attributes.name}`}
                  width={200}
                  height={264}
                  loading="lazy"
                  className="w-full h-38 sm:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
                  <ThemeText className="text-[#fff] text-sm sm:text-lg space-x-1">
                    {collection.attributes.name}
                    {`(${collection.attributes?.community_count})`}
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
