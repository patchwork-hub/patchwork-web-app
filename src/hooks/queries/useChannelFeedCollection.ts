import { getChannelFeedCollections } from "@/services/home-feed/getChannelFeedCollections";
import { useQuery } from "@tanstack/react-query";

export const useChannelFeedCollection = (options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["channel-feed-collection-list"],
    queryFn: getChannelFeedCollections,
    enabled: options?.enabled
  });
};
