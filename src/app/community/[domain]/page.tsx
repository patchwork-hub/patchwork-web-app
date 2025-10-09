"use client";

import { AnimatePresence } from "framer-motion";
import { use, useState } from "react";
import { CommunityTimeline } from "@/components/organisms/status/CommunityTimeline";
import { ensureHttp } from "@/utils/helper/helper";
import {
  useChannelDetail,
  useGetCommunityAbout,
  useGetCommunityInfo,
} from "@/hooks/queries/useGetChannelAbout.query";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/providers/localeProvider";
import CommunityBanner from "@/components/molecules/common/CommunityBanner";
import MappedTabs from "@/components/molecules/common/MappedTabs";
import ChannelGuidelines from "@/components/molecules/common/CommunittyGuidelines";
import CommunityAbout from "@/components/molecules/common/CommunityAbout";
import { ChannelDetail } from "@/types/patchwork";

export default function Following({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = use(params);

  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const ensuDomain = ensureHttp(domain);
  const hasSlug = Boolean(slug);
  const {t} = useLocale();

  const [activeTab, setActiveTab] = useState<string>("posts");
  const tabs = [
    { name: `${t("common.posts")}`, value: "posts" },
    { name: `${t("common.about")}`, value: "about" },
  ];
  const { data: channelAbout } = useGetCommunityAbout(ensuDomain);
  const { data: channelAdditionalInfo } = useGetCommunityInfo(ensuDomain);
  const { data: channelDetail } = useChannelDetail({ id: slug });
  
  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
  };

  return (
    <div className="relative">
      <CommunityBanner
        newsmastInstance={slug === null ? channelAbout : undefined}
        channelDetail={channelDetail as ChannelDetail}
        showButton={false}
      />
      <div>
        <AnimatePresence mode="wait">
          <>
            <div className="sticky top-0 z-10 bg-background">
              <MappedTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs}
              />
            </div>
            {activeTab === "about" && (
              <>
                <ChannelGuidelines channelAbout={channelAbout as unknown as ChannelDetail} />
                <CommunityAbout
                  channelAdditionalInfo={channelAdditionalInfo}
                  channelAbout={channelAbout}
                  channelDetail={channelDetail}
                />
              </>
            )}
            {activeTab === "posts" && (
              <div className="pb-4">
                <CommunityTimeline local={!hasSlug} domain={ensuDomain} />
              </div>
            )}
          </>
        </AnimatePresence>
      </div>
    </div>
  );
}
