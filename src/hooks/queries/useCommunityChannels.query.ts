import { fetchCommunityChannel } from "@/services/community/communityChannelService";
import { GetDetailCollectionChannelListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useDetailCollectionChannelList = ({
  slug,
  type,
}: {
  slug: string;
  type?: "newsmast" | "channel";
}) => {
  const queryKey: GetDetailCollectionChannelListQueryKey = [
    "detail-collection-channels",
    { slug, type },
  ];
  return useQuery({
    queryKey,
    queryFn: fetchCommunityChannel,
  });
};
