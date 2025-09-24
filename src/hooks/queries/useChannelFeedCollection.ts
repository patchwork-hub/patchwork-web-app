import { getChannelFeedCollections } from "@/services/home-feed/getChannelFeedCollections";
import { getNewsmastCollections } from "@/services/home-feed/getNewsmastCollections";
import { GetNewsmastCollectionListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useChannelFeedCollection = (options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["channel-feed-collection-list"],
    queryFn: getChannelFeedCollections,
    enabled: options?.enabled
  });
};
