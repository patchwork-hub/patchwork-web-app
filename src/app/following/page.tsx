"use client";
import { DisplayName } from "@/components/atoms/common/DisplayName";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import MappedTabs from "@/components/atoms/common/MappedTabs";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import HomeHeader from "@/components/atoms/home-feed/HomeHeader";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import { HomeTimeline } from "@/components/organisms/status/HomeTimeline";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { useFollowingAccountsQuery } from "@/hooks/queries/useFollowingAccount";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { truncateUsername } from "@/lib/utils";
import { useSelectedDomain } from "@/store/auth/activeDomain";
import { CHANNEL_ORG_INSTANCE } from "@/utils/constant";
import { AnimatePresence, motion } from "framer-motion";
import { ListIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Following() {
  const { data: userInfo } = useVerifyAuthToken({ enabled: true });
  const router = useRouter();
  const {t} = useLocale();
  const domain_name = useSelectedDomain();
  const [activeTab, setActiveTab] = useState<string>("activity");
  const tabs = [
    { name: `${t("tab.activity")}`, value: "activity" },
    { name: `${t("tab.people")}`, value: "people" },
  ];

  const { data: peopleFollowing, isLoading: peopleFollowingLoading } =
    useFollowingAccountsQuery({
      accountId: userInfo?.id!,
      enabled: !!userInfo?.id,
    });
console.log("peopleFollowing", peopleFollowing);
  const modifiedData = true
    ? // domain_name === DEFAULT_API_URL // client might want to change this later, set true for now
      peopleFollowing?.pages[0].data
    : [{ id: "icon" } as Account, ...(peopleFollowing?.pages[0]?.data ?? [])];

  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
  };

  const itemVariants = {
    hidden: (custom: { tab: string; index: number }) => ({
      opacity: 0,
      x: custom.tab === "people" ? 20 : -20,
      y: 0,
      transition: { delay: custom.index * 0.1 },
    }),
    visible: (custom: { tab: string; index: number }) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        delay: custom.index * 0.1,
      },
    }),
  };
  return (
    <LayoutContainer>
      <HomeHeader />
      <div>
        <AnimatePresence mode="wait">
          <>
            <div className="sticky top-24 z-10 bg-background">
              <MappedTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs}
              />
            </div>
            {activeTab === "people" &&
              (peopleFollowingLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 px-4 justify-start place-content-center place-items-center w-full max-w-full mb-auto mt-4">
                    {modifiedData?.map((account, index) => (
                      <motion.div
                        key={index}
                        className="relative cursor-pointer"
                        custom={{ tab: "people", index }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                        onClick={() => router.push(`/@${account.acct}`)}
                      >
                        <div
                          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                            index === 0 ? "ml-4" : ""
                          } ${index === 9 ? "mr-4" : ""}`}
                        >
                          {account.id === "icon" ? (
                            <ListIcon
                              stroke="black"
                              className="bg-white w-24 h-24 sm:w-32  sm:h-32 md:w-38  md:h-38 object-cover rounded-full transition-all duration-300 ease-in-out"
                            />
                          ) : (
                            <Image
                              src={account.avatar}
                              alt={`${account.username} image`}
                              width={200}
                              height={200}
                              loading="lazy"
                              className="w-24 h-24 sm:w-32  sm:h-32 md:w-38  md:h-38 object-cover rounded-full transition-all duration-300 ease-in-out aspect-square"
                            />
                          )}
                          <div className="absolute top-0 left-0 w-24 h-24 sm:w-32  sm:h-32 md:w-38  md:h-38 bg-gradient-to-b from-transparent to-black/70 rounded-full transition-all duration-300 ease-in-out" />
                          <ThemeText
                            size="xl_20"
                            className="text-white mt-1 text-sm"
                          >
                            {account.id === "icon" ? (
                              <ThemeText className="" variant="textGrey">
                                following
                              </ThemeText>
                            ) : (
                              <DisplayName
                                emojis={
                                  account.emojis as unknown as MastodonCustomEmoji[]
                                }
                                acct={account.acct}
                                displayName={truncateUsername(
                                  account.display_name || account.username
                                )}
                              />
                            )}
                          </ThemeText>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ))}
            {activeTab === "activity" && (
              <div className="pb-4">
                <HomeTimeline instanceUrl={domain_name} />
              </div>
            )}
          </>
        </AnimatePresence>
      </div>
    </LayoutContainer>
  );
}
