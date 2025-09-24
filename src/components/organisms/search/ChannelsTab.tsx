import React from "react";
import ChannelView from "./ChannelView";

interface ChannelBySearchProps {
  searchData: ChannelAndCollectionSearch;
  loading?: boolean;
  fromHome?: boolean; 
}

const ChannelBySearch: React.FC<ChannelBySearchProps> = ({ searchData, loading, fromHome }) => {
  return (
    <ChannelView
      channelFeeds={searchData?.channel_feeds.data}
      communities={searchData?.communities.data}
      newsmastChannels={searchData?.newsmast_channels.data}
      loading={loading}
      fromHome={fromHome}
    />
  );
};

export default ChannelBySearch;
