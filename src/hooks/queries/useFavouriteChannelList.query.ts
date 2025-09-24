import {
  getFavouriteChannelLists,
  getJoinedCommunitiesList
} from "@/services/home-feed/favouriteChannelLists";
import {
  GetFavouriteChannelListsQueryKey,
  GetJoinedCommunitiesListQueryKey
} from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useFavouriteChannelLists = (options?: {
  enabled?: boolean;
  instance_domain?: string;
  platform_type?: string;
}) => {
  const queryKey: GetFavouriteChannelListsQueryKey = [
    "favourite-channel-lists"
  ];
  return useQuery<ChannelList[], Error>({
    queryKey,
    queryFn: () =>
      getFavouriteChannelLists({
        instance_domain: options?.instance_domain,
        platform_type: options?.platform_type
      }),
    enabled: options?.enabled,
    retry: false
  });
};

export const useJoinedCommunitiesList = (options?: {
  enabled?: boolean;
  instance_domain?: string;
  platform_type?: string;
}) => {
  const queryKey: GetJoinedCommunitiesListQueryKey = [
    "joined-communities-list"
  ];
  return useQuery<
    { data: JoinedCommunitiesList[]; meta: { total: number } },
    Error
  >({
    queryKey,
    queryFn: () =>
      getJoinedCommunitiesList({
        instance_domain: options?.instance_domain,
        platform_type: options?.platform_type
      }),
    enabled: options?.enabled,
    retry: false
  });
};
