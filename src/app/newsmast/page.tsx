"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { FALLBACK_PREVIEW_NEWSMAST_URL } from "@/constants/url";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";
import { isValidImageUrl } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewsmastChannelsPage() {
  const { data: lists, isLoading: newsmastLoading } = useNewsmastCollections();
  const router = useRouter();

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <LayoutContainer>
      <Header title="Newsmast channels" />
      <AnimatePresence mode="wait">
        {newsmastLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            key="newsmast-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 px-4 justify-start w-full max-w-full mb-auto mt-4 pb-20 sm:pb-4"
          >
            {lists?.map((list, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() =>
                  router.push(`/newsmast-channel/${list.attributes.slug}`)
                }
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
                  <p className="text-[#fff] flex items-center text-sm space-x-1 max-w-20">
                    {list.attributes.name}{" "}
                    {`(${list.attributes?.community_count})`}
                  </p>
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
