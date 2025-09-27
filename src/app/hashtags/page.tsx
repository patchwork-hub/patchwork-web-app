"use client";
import Header from "@/components/atoms/common/Header";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import { useGetHashtagsFollowing } from "@/hooks/queries/useHashtag.query";
import { useAuthStore } from "@/store/auth/authStore";
import { useSelectedDomain } from "@/store/auth/activeDomain";
import { calculateHashTagCount } from "@/utils/helper/helper";
import { useLocale } from "@/components/molecules/providers/localeProvider";

export default function HashtagsPage() {
  const domain_name = useSelectedDomain();
  const {t} = useLocale();
  const { userOriginInstance } = useAuthStore();

  const { data: hashtagsFollowing, isLoading: hashtagsFollowingLoading } =
    useGetHashtagsFollowing({
      limit: 100,
      domain_name: domain_name,
      options: { enabled: domain_name === userOriginInstance },
    });
  const router = useRouter();

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const toHashtagTimeline = (hashtag: string) => {
    router.push(`/hashtags/${hashtag}`);
  };

  return (
    <>
      <Header title={t("hashtags_following")} />
      <AnimatePresence mode="wait">
        {hashtagsFollowingLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            key="hashtags-grid"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 justify-start w-full max-w-full mb-auto mt-4"
          >
            {hashtagsFollowing?.map((item, index) => (
              <motion.div
                key={index}
                className={`cursor-pointer flex items-center justify-between px-4 pb-2 ${
                  index === hashtagsFollowing.length - 1
                    ? ""
                    : " border-b border-b-gray-600"
                }`}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                onClick={() => toHashtagTimeline(item.name)}
              >
                <div className="">
                  <p className="text-start">#{item.name}</p>
                  <p className="opacity-60">{`${calculateHashTagCount(
                    item.history,
                    "uses"
                  )} posts from ${calculateHashTagCount(
                    item.history,
                    "accounts"
                  )} participants`}</p>
                </div>
                <ChevronRightIcon />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
