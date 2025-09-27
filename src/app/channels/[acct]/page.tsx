"use client";

import ChannelGuidelines from "@/components/atoms/common/CommunittyGuidelines";
import CommunityAbout from "@/components/atoms/common/CommunityAbout";
import MappedTabs from "@/components/atoms/common/MappedTabs";
import CommunityBanner from "@/components/molecules/common/CommunityBanner";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { AccountStatusList } from "@/components/organisms/status/AccountStatusList";
import { AccountWrapper } from "@/components/pages/account/AccountWrapper";
import {
  useDeleteFavouriteChannelMutation,
  useFavouriteChannelMutation,
} from "@/hooks/mutations/community/useToggleCommunity";
import {
  useChannelDetail,
  useGetCommunityAbout,
  useGetCommunityInfo,
} from "@/hooks/queries/useGetChannelAbout.query";
import {
  GetChannelDetailQueryKey,
  GetFavouriteChannelListsQueryKey,
} from "@/types/queries/channel.type";
import { DEFAULT_API_URL } from "@/utils/constant";
import { AnimatePresence } from "framer-motion";
import { use, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ acct: string }>;
}) {
  const { acct } = use(params);
  return (
    <AccountWrapper
      params={Promise.resolve({ acct: `${acct}@channel.org` })}
      isChannel
      render={({ accountId, data }) => (
        <ChannelProfile accountId={accountId} acct={acct} data={data} />
      )}
    />
  );
}

function ChannelProfile({
  acct,
  accountId,
  data,
}: {
  acct: string;
  accountId: string;
  data: any;
}) {
  const domain = DEFAULT_API_URL;
  const {t} = useLocale();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const tabs = [
    { name: `${t("tab.posts")}`, value: "posts" },
    { name: `${t("tab.about")}`, value: "about" },
  ];
  const { data: channelAbout } = useGetCommunityAbout(domain);
  const { data: channelAdditionalInfo } = useGetCommunityInfo(domain);
  const { data: channelDetail } = useChannelDetail({ id: acct });
  const isChannel = channelDetail?.type === "channel";
  const { mutate: favouriteChannelMutate } = useFavouriteChannelMutation({
    onSuccess(data) {
      const channelDetailQueryKey: GetChannelDetailQueryKey = [
        "channel-detail",
        { id: isChannel ? channelDetail?.attributes.slug ?? "" : "" },
      ];
      queryClient.setQueryData<ChannelList>(channelDetailQueryKey, (old) => {
        if (!old) return;
        return {
          ...old,
          attributes: {
            ...old.attributes,
            favourited: !old.attributes.favourited,
          },
        };
      });

      const favouriteChannelListsQueryKey: GetFavouriteChannelListsQueryKey = [
        "favourite-channel-lists",
      ];
      queryClient.invalidateQueries({
        queryKey: favouriteChannelListsQueryKey,
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  const { mutate: deleteFavouriteChannelMutate } =
    useDeleteFavouriteChannelMutation({
      onSuccess(data, variables) {
        const channelDetailQueryKey: GetChannelDetailQueryKey = [
          "channel-detail",
          { id: isChannel ? channelDetail?.attributes.slug ?? "" : "" },
        ];
        queryClient.setQueryData<ChannelList>(channelDetailQueryKey, (old) => {
          if (!old) return;
          return {
            ...old,
            attributes: {
              ...old.attributes,
              favourited: !old.attributes.favourited,
            },
          };
        });

        const favouriteChannelListsQueryKey: GetFavouriteChannelListsQueryKey =
          ["favourite-channel-lists"];

        queryClient.setQueryData<ChannelList[]>(
          favouriteChannelListsQueryKey,
          (oldList) => {
            if (!oldList) return;
            return oldList.filter(
              (item) => item.attributes.slug !== variables.id
            );
          }
        );
      },
      onError(error) {
        console.error(error);
      },
    });
  const toggleChannel = (isFav: boolean) => {
    isFav
      ? deleteFavouriteChannelMutate({
          id: channelDetail?.attributes.slug!,
        })
      : favouriteChannelMutate({ id: channelDetail?.attributes.slug! });
  };
  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
  };

  return (
    <div className="relative">
      <CommunityBanner
        showButton={false}
        channelDetail={data ? data : channelDetail}
        toggleChannel={toggleChannel}
        showBio
        isChannel
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
                <ChannelGuidelines channelAbout={channelAbout} />
                <CommunityAbout
                  channelAdditionalInfo={channelAdditionalInfo}
                  channelAbout={channelAbout ?? channelAbout}
                  channelDetail={channelDetail}
                />
              </>
            )}
            {activeTab === "posts" && (
              <div className="pb-4">
                <AccountStatusList
                  id={accountId}
                  excludeReplies
                  reblogAsOriginal
                />
              </div>
            )}
          </>
        </AnimatePresence>
      </div>
    </div>
  );
}
