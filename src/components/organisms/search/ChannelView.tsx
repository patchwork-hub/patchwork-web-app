import React from "react";
import Cookies from "js-cookie";
import Communities from "@/components/molecules/home-feed/Communities";
import NewsMastChannels from "@/components/molecules/home-feed/NewsmastChannel";
import Channels from "@/components/molecules/home-feed/Channels";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import { useGetChannelFeedListQuery } from "@/hooks/queries/useChannelList.query";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";
import { SearchX } from "lucide-react";
import { ChannelsSearchResults } from "./ChannelsSearchResults";
import { useLocale } from "@/providers/localeProvider";
import { ChannelList } from "@/types/patchwork";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { Instance_V2 } from "@/types/auth";

type ChannelViewProps = {
  channelFeeds: ChannelList[];
  communities: ChannelList[];
  newsmastChannels: ChannelList[];
  loading?: boolean;
  fromHome?: boolean;
}

const ChannelView: React.FC<ChannelViewProps> = ({
  channelFeeds,
  communities,
  newsmastChannels,
  loading = false,
  fromHome = false,
}) => {
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { t } = useLocale();

  const { data: collectionList, isLoading: collectionLoading } =
    useCollectionChannelList();

  const { data: newsmastColletionlList, isLoading: newsmastLoading } =
    useNewsmastCollections();

  const { data: channelFeedList, isLoading: channelFeedLoading } =
    useGetChannelFeedListQuery({
      enabled: true,
    });

  const { data: serverInfo } = useSearchServerInstance({
    domain: domain,
    enabled: domain !== DEFAULT_API_URL,
  });

  if (
    channelFeeds?.length === 0 &&
    communities?.length === 0 &&
    newsmastChannels?.length === 0
  ) {
    return (
      <div className="flex items-center justify-center flex-col gap-y-2 h-[calc(100vh-215px)]">
        <SearchX className="w-10 h-10" />
        <p className="text-gray-400 font-semibold">{t("search.no_result")}</p>
      </div>
    );
  }

  return (
    <div className="pb-6 h-full">
      {loading && fromHome ? (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner/>
        </div>
      ) : (
        <>
          {communities ? (
            <ChannelsSearchResults data={communities} type="channel" />
          ) : (
            !fromHome && (
              <Communities
                collections={collectionList ?? []}
                loading={collectionLoading}
                activeTab="channels"
              />
            )
          )}

          {newsmastChannels ? (
            <ChannelsSearchResults
              data={newsmastChannels}
              type="newsmast-channel"
            />
          ) : (
            !fromHome && (
              <NewsMastChannels
                lists={newsmastColletionlList ?? []}
                loading={newsmastLoading}
                activeTab="channels"
              />
            )
          )}

          {channelFeeds ? (
            <Channels
              lists={channelFeeds}
              loading={channelFeedLoading}
              serverInfo={serverInfo as Instance_V2}
              hideViewAll
              hideSpecialCard
              activeTab="channels"
            />
          ) : (
            !fromHome && (
              <Channels
                lists={channelFeedList ?? []}
                loading={channelFeedLoading}
                serverInfo={serverInfo as Instance_V2}
                activeTab="channels"
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default ChannelView;
