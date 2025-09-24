import { getChannelListForChannelSection } from "@/services/home-feed/channelListService";
import { GetChannelFeedListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useGetChannelFeedListQuery = (options?: { enabled: boolean }) => {
  const queryKey: GetChannelFeedListQueryKey = ["channel-feed-list"];
  return useQuery({
    queryKey,
    queryFn: getChannelListForChannelSection,
    enabled: options?.enabled,
  });
};
