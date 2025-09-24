import { getMyChannel } from "@/services/home-feed/myChannelService";
import { GetMyChannelQueryKey } from "@/types/queries/channel.type";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { useQuery } from "@tanstack/react-query";

export const useMyChannel = ({
  options,
  ...queryParam
}: GetMyChannelQueryKey[1] & {
  options?: QueryOptionHelper<MyChannel | undefined>;
}) => {
  const queryKey: GetMyChannelQueryKey = ["my-channel", queryParam];

  return useQuery({
    queryKey,
    queryFn: getMyChannel,
    retry: false,
    ...options,
  });
};
