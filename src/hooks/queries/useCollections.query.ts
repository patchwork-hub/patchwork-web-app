import { getCollectionChannelList } from "@/services/home-feed/communitiesService";

import { GetCollectionChannelListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useCollectionChannelList = () => {
  const queryKey: GetCollectionChannelListQueryKey = ["collection-channels"];
  return useQuery({
    queryKey,
    queryFn: getCollectionChannelList,
    retry: false,
    refetchOnMount: false,
  });
};
