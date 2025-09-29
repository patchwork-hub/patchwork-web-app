"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { useCommunityPeopleToFollow } from "@/hooks/queries/useGetChannelAbout.query";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { isSystemDark } from "@/utils/helper/helper";
export default function ContributorLists({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const router = useRouter();
    const { theme } = useTheme();
    const { slug: routeSlug } = use(params);
    const { data: communityPeopleToFollow } = useCommunityPeopleToFollow({
        slug: routeSlug,
        domain_name: DEFAULT_DASHBOARD_API_URL,
    });
    return (

        <div className="relative h-full">
            <Header title="Contributors" />
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
                        <div className="flex flex-col gap-4">
                            {/* <p className="text-start font-bold text-[15px] mb-4">
                                Community hashtags
                            </p> */}
                           
                                {communityPeopleToFollow?.contributors?.map((account, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`relative flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity duration-300`}
                                        >
                                            <Image
                                                src={account?.attributes.avatar_url ?? FALLBACK_PREVIEW_IMAGE_URL}
                                                alt={`${account?.attributes?.username} image`}
                                                onClick={() => router.push(`/${account?.attributes?.profile_url}`)}
                                                width={200}
                                                height={200}
                                                loading="lazy"
                                                className="w-10 sm:w-10 h-10 sm:h-10 object-cover rounded-full transition-all duration-300 ease-in-out"
                                            />
                                            <div onClick={() => router.push(`/${account?.attributes?.profile_url}`)} className="absolute top-0 left-0 w-10 sm:w-10 h-10 sm:h-10 bg-gradient-to-b from-transparent to-black/70 rounded-full transition-all duration-300 ease-in-out" />
                                            <div
                                                className={cn(
                                                    "text-center",
                                                    theme === "dark" || (theme === "system" && isSystemDark)
                                                        ? "text-white"
                                                        : "text-black"
                                                )}
                                                onClick={() => router.push(`${account?.attributes?.profile_url}`)}
                                            >
                                                {account.attributes.display_name}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>


    );
}
