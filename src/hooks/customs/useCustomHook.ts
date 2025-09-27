import { ChannelList, MyChannel } from "@/types/patchwork";
import { useMemo } from "react";

export const useChannelFeedReOrder = <T extends ChannelList>(
  channelList?: T[] | undefined,
  myChannels?: MyChannel | undefined,
  isMastodonInstance?: boolean
) => {
  return useMemo(() => {
    if (isMastodonInstance) return channelList;
    if (!myChannels || !channelList) return [];
    const myChannel = myChannels.channel_feed?.data || myChannels.channel?.data;
    if (!myChannel) return channelList;

    const index = channelList.findIndex(
      (ch) =>
        "display_name" in myChannel.attributes &&
        ch.attributes.name === myChannel.attributes.display_name
    );

    if (index === -1) return channelList;

    const newList = [...channelList];
    const [movedItem] = newList.splice(index, 1);
    newList.unshift(movedItem);

    return newList;
  }, [channelList, myChannels]);
};
