"use client";
import Header from "@/components/atoms/common/Header";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import { useCommunityBioHashtags } from "@/hooks/queries/useGetChannelAbout.query";
import { DEFAULT_DASHBOARD_API_URL, isDevelopment, STAGING_DASHBOARD_API_URL } from "@/utils/constant";
import { calculateHashTagCount } from "@/utils/helper/helper";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon, Menu, PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
export default function HashtagLists({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
 const router = useRouter();
 const { slug: routeSlug } = use(params);
 const { data: communityHashtag } = useCommunityBioHashtags({
    slug: routeSlug,
    domain_name: DEFAULT_DASHBOARD_API_URL,
  });
    return (

        <div className="relative h-full">
            <Header title="Hashtags" />
            <AnimatePresence mode="wait">
                {false ? (
                    <LoadingSpinner />
                ) : (
                    <motion.div
                        key="lists-grid"
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 gap-4 justify-start w-full max-w-full mb-auto mt-4 px-4"
                    >
                        <div className="border-b border-b-gray-600 py-4">
                            <p className="text-start font-bold text-[15px] mb-4">
                                Community hashtags
                            </p>
                            <div>
                                {communityHashtag?.data?.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer flex items-center justify-between py-2 ${index === communityHashtag?.data.length - 1
                                            ? ""
                                            : " border-b border-b-gray-600"
                                            }`}
                                        onClick={() => router.push(`/hashtags/${item.name}`)}
                                    >
                                        <div className="">
                                            <p className="text-start">#{item.name}</p>
                                            {/* <p className="opacity-60">{`${calculateHashTagCount(
                                                item.history,
                                                "uses"
                                            )} posts from ${calculateHashTagCount(
                                                item.history,
                                                "accounts"
                                            )} participants`}</p> */}
                                        </div>
                                        <ChevronRightIcon />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>


    );
}
