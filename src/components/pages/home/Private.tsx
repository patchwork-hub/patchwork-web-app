"use client";

import Channels from "@/components/molecules/home-feed/Channels";
import Communities from "@/components/molecules/home-feed/Communities";
import HashtagLists from "@/components/molecules/home-feed/HashtagLists";
import MyChannels from "@/components/molecules/home-feed/MyChannels";
import MyLists from "@/components/molecules/home-feed/MyLists";
import NewsmastChannels from "@/components/molecules/home-feed/NewsmastChannel";
import PeopleFollowing from "@/components/molecules/home-feed/PeopleFollowing";
import { useEffect, useState } from "react";

import { useGetChannelFeedListQuery } from "@/hooks/queries/useChannelList.query";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import { useFavouriteChannelLists } from "@/hooks/queries/useFavouriteChannelList.query";
import { useFollowingAccountsQuery } from "@/hooks/queries/useFollowingAccount";
import { useGetHashtagsFollowing } from "@/hooks/queries/useHashtag.query";
import { useListsQueries } from "@/hooks/queries/useLists.query";
import { useMyChannel } from "@/hooks/queries/useMyChannel.query";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";

import {
  CHANNEL_ORG_INSTANCE,
  DEFAULT_API_URL,
  DEFAULT_DASHBOARD_API_URL,
} from "@/utils/constant";
import { ensureHttp } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { HomeTimeline } from "@/components/organisms/status/HomeTimeline";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/providers/localeProvider";
import { getToken } from "@/lib/auth";
import { useActiveDomainStore, useSelectedDomain } from "@/stores/auth/activeDomain";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import { useChannelFeedReOrder } from "@/hooks/customs/useCustomHook";
import LayoutContainer from "@/components/templates/LayoutContainer";
import HomeHeader from "@/components/molecules/HomeHeader";
import MappedTabs from "@/components/molecules/common/MappedTabs";
import { Instance_V2 } from "@/types/auth";
import { Account } from "@/types/patchwork";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("activeTab") ?? "home";
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { t } = useLocale();
  const token = getToken();
  const { data: userInfo } = useVerifyAuthToken({ enabled: !!token });
  const [activeTab, setActiveTab] = useState<string>("home");
  const tabs = [
    { name: `${t("timeline.home")}`, value: "home" },
    { name: `${t("timeline.channels")}`, value: "channels" },
  ];

  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
    router.replace(`/home?activeTab=${tab.value}`);
  };

  const domain_name = useSelectedDomain();

  const { actions } = useActiveDomainStore();
  const { data: serverInfo } = useSearchServerInstance(
    {
      domain: domain,
      enabled: domain !== DEFAULT_API_URL,
    }
  );

 const {
  data: myChannels,
  isSuccess: myChannelSuccess,
  isLoading: myChannelLoading,
} = useMyChannel(
  { 
    domain_name:
      process.env.NEXT_PUBLIC_DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
  },
  {
    enabled: domain_name === CHANNEL_ORG_INSTANCE,
  }
);
  const { data: favouriteChannelLists, isLoading: favLoading } =
    useFavouriteChannelLists({
      instance_domain: domain,
      platform_type: "newsmast.social",
    });

  const { data: collectionList, isLoading: collectionLoading } =
    useCollectionChannelList();

  const { data: newsmastColletionlList, isLoading: newsmastCollectionLoading } =
    useNewsmastCollections();

  const { data: channelFeedList, isLoading: channelFeedLoading } =
    useGetChannelFeedListQuery({
      enabled: domain === CHANNEL_ORG_INSTANCE ? myChannelSuccess : true,
    });

  const { data: peopleFollowing, isLoading: peopleFollowingLoading } =
    useFollowingAccountsQuery({
      accountId: userInfo?.id ? userInfo?.id : "",
      enabled: !!userInfo?.id,
    });

  const { data: myLists, isLoading: myListsLoading } = useListsQueries();

  const { data: hashtagsFollowing, isLoading: hashtagsFollowingLoading } =
  useGetHashtagsFollowing(
    {
      limit: 100,
      domain_name: domain_name,
    },
    {
      enabled: domain_name === ensureHttp(domain),
    }
  );

  const reorderedChannelFeedList = useChannelFeedReOrder(
    channelFeedList,
    myChannels,
    domain !== CHANNEL_ORG_INSTANCE
  );
  const isDefaultApi = domain === DEFAULT_API_URL;

  useEffect(() => {
    if (domain_name !== domain) {
      actions.setDomain(domain);
    }
  }, []);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  return (
    <LayoutContainer>
      <HomeHeader />
      <div className="sticky top-24 z-10">
        <MappedTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      </div>
      {activeTab === "channels" && (
        <>
          <MyChannels
            loading={myChannelLoading || favLoading}
            favList={favouriteChannelLists}
          />
          <PeopleFollowing
            data={
              peopleFollowing && Array.isArray(peopleFollowing.pages) && peopleFollowing.pages[0] && typeof peopleFollowing.pages[0] === "object" && "data" in peopleFollowing.pages[0]
                ? (peopleFollowing.pages[0]).data as Account[]
                : []
            }
            loading={peopleFollowingLoading}
          />

          {isDefaultApi && (
            <NewsmastChannels
              lists={newsmastColletionlList ?? []}
              loading={newsmastCollectionLoading}
            />
          )}
          <Channels
            lists={reorderedChannelFeedList ?? []}
            loading={channelFeedLoading}
            serverInfo={serverInfo ?? ({} as Instance_V2)}
          />
          {!isDefaultApi && (
            <NewsmastChannels
              lists={newsmastColletionlList ?? []}
              loading={newsmastCollectionLoading}
            />
          )}

          <Communities
            collections={collectionList ?? []}
            loading={collectionLoading}
          />

          <HashtagLists
            data={hashtagsFollowing ?? []}
            loading={hashtagsFollowingLoading}
          />

          <MyLists data={myLists ?? []} loading={myListsLoading} />
        </>
      )}
      {activeTab === "home" && (
        <div className="mb-4">
          <HomeTimeline
            excludeDirect
            excludeReplies
            instanceUrl={domain_name}
            limit={50}
          />
        </div>
      )}
    </LayoutContainer>
  );
};

export default Home;
