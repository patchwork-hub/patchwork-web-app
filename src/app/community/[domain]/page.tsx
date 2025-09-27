"use client";

import { AnimatePresence } from "framer-motion";
import { use, useState } from "react";
import MappedTabs from "@/components/atoms/common/MappedTabs";
import { CommunityTimeline } from "@/components/organisms/status/CommunityTimeline";
import { ensureHttp } from "@/utils/helper/helper";
import {
  useChannelDetail,
  useGetCommunityAbout,
  useGetCommunityInfo,
} from "@/hooks/queries/useGetChannelAbout.query";
import ChannelGuidelines from "@/components/atoms/common/CommunittyGuidelines";
import CommunityAbout from "@/components/atoms/common/CommunityAbout";
import { useSearchParams } from "next/navigation";
import CommunityBanner from "@/components/molecules/common/CommunityBanner";
import {
  useDeleteFavouriteChannelMutation,
  useFavouriteChannelMutation,
} from "@/hooks/mutations/community/useToggleCommunity";
import {
  GetChannelDetailQueryKey,
  GetFavouriteChannelListsQueryKey,
} from "@/types/queries/channel.type";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import {
  CHANNEL_ORG_INSTANCE,
  DEFAULT_API_URL,
  MOME_INSTANCE,
} from "@/utils/constant";
import { useSelectedDomain } from "@/store/auth/activeDomain";
import { useLocale } from "@/components/molecules/providers/localeProvider";

export default function Following({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = use(params);

  const domain_name = useSelectedDomain();

  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
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
  const isChannel = channelDetail?.type === "channel";
  const isNewsmast = domain_name === MOME_INSTANCE;
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
        newsmastInstance={slug === null ? channelAbout : undefined}
        channelDetail={channelDetail}
        showButton={false}
        // isNewsmast={isNewsmast}
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
                <CommunityTimeline local={!hasSlug} domain={ensuDomain} />
              </div>
            )}
          </>
        </AnimatePresence>
      </div>
    </div>
  );
}
