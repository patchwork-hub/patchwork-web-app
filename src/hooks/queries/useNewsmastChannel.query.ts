import { getNewsmastChannelList } from "@/services/home-feed/newsmastChannelsService";
import { GetNewsmastChannelListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

type UseGetNewsmastChannelListOptions = {
  enabled?: boolean;
  instance_domain?: string ;
}

export const useGetNewsmastChannelList = (
  options?: UseGetNewsmastChannelListOptions
) => {
  const instanceDomain = options?.instance_domain ?? "";
  const queryKey: GetNewsmastChannelListQueryKey = [
    "newsmast-channel-list",
    { instance_domain: instanceDomain },
  ];
  return useQuery({
    queryKey,
    queryFn: () =>
      getNewsmastChannelList({ instance_domain: options?.instance_domain }),
    enabled: options?.enabled,
  });
};
