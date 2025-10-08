"use client";

import { useLocale } from "@/providers/localeProvider";
import { AccountStatusList } from "@/components/organisms/status/AccountStatusList";
import { useSearchQuery } from "@/hooks/queries/search/useSearchQuery";
import { useCheckAccountRelationship } from "@/hooks/queries/status/useCheckAccountRelationship";
import { useNewsmastDetail } from "@/hooks/queries/status/useNewsmastDetail";
import {
  useCommunityBioHashtags,
  useCommunityDetailProfile,
  useCommunityPeopleToFollow,
} from "@/hooks/queries/useGetChannelAbout.query";
import { DEFAULT_DASHBOARD_API_URL} from "@/utils/constant";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { Account } from "@/types/account";
import CommunityBanner from "@/components/molecules/common/CommunityBanner";
import MappedTabs from "@/components/molecules/common/MappedTabs";
import ChannelGuidelines from "@/components/molecules/common/CommunittyGuidelines";
import CommunityAbout from "@/components/molecules/common/CommunityAbout";
import { ChannelAbout, ChannelDetail } from "@/types/patchwork";

type PeopleSearchResult = {
  url: string;
  data: {
    accounts: Account[];
  };
  isLoading: boolean;
  error: Error | null;
}

export default function Following({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: routeSlug } = use(params); // From route
  const searchParams = useSearchParams();
  const {t} = useLocale();
  const querySlug = searchParams.get("slug") ?? ""; // From ?slug=...

  const finalUsername = querySlug.startsWith("@")
    ? querySlug.slice(1)
    : querySlug;

  const { data: newsmastChannelDetail } = useNewsmastDetail(querySlug);
  const [peopleSearchResults] = useState<PeopleSearchResult[]>([]);

  const [activeTab, setActiveTab] = useState<string>("posts");
  const tabs = [
    { name: `${t("common.posts")}`, value: "posts" },
    { name: `${t("common.about")}`, value: "about" },
  ];

  const { data: communityDetail } = useCommunityDetailProfile({
    id: routeSlug,
    domain_name: DEFAULT_DASHBOARD_API_URL,
  });

  const { data: communityHashtag } = useCommunityBioHashtags({
    slug: routeSlug,
    domain_name: DEFAULT_DASHBOARD_API_URL,
    enabled: !!communityDetail?.id
  });

  const { data: communityPeopleToFollow } = useCommunityPeopleToFollow({
    slug: routeSlug,
    domain_name : DEFAULT_DASHBOARD_API_URL,
     enabled: !!communityDetail?.id
  });

  const accountIds = peopleSearchResults
    .filter((result) => result.data && !result.error)
    .flatMap((result) => result.data.accounts.map((account: Account) => account.id))
    .filter(Boolean);

  const queryString = accountIds
    .map((id) => `id[]=${id}`)
    .join("&")
    .replace(/^id\[\]=/, "");

  const { data: relationships, refetch } = useCheckAccountRelationship({
    id: queryString,
    enabled: accountIds.length > 0,
  });

  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
  };

  const { data: searchResults } = useSearchQuery({
    query: querySlug,
    type: "accounts",
    enabled: true,
  });

  const accountId = searchResults?.accounts?.find((it) =>
    querySlug.includes(it.acct)
  )?.id;
  return (
    <div className="relative">
      <CommunityBanner
        newsmastChannelDetail={communityDetail as ChannelDetail}
        acct={finalUsername}
        showButton={false}
        isNewsmast
        joinDate={newsmastChannelDetail?.created_at}
      />
      <div>
        <AnimatePresence mode="wait">
          <>
            <div className="sticky top-0 z-10 bgb-background">
              <MappedTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs}
              />
            </div>
            {activeTab === "about" && (
              <>
                <ChannelGuidelines channelAbout={communityDetail as ChannelDetail} />
                <CommunityAbout
                  communityHashtag={communityHashtag}
                  channelAbout={newsmastChannelDetail as unknown as ChannelAbout}
                  isCommunity
                  channelDetail={communityDetail}
                  suggestedPeople={communityPeopleToFollow}
                  relationships={relationships}
                  onRefetch={refetch}
                  querySlug={querySlug}
                />
              </>
            )}
            {activeTab === "posts" && (
              <div className="pb-4">
                {accountId && (
                  <AccountStatusList reblogAsOriginal id={accountId} />
                )}
              </div>
            )}
          </>
        </AnimatePresence>
      </div>
    </div>
  );
}
