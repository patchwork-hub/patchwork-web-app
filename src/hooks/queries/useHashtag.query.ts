import { getHashtagsFollowing } from "@/services/home-feed/hashtagService";
import { HashtagsFollowingQueryKey } from "@/types/queries/hashtag.type";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { useQuery } from "@tanstack/react-query";

export const useGetHashtagsFollowing = ({
  options,
  ...queryParam
}: HashtagsFollowingQueryKey[1] & {
  options?: QueryOptionHelper<HashtagsFollowing[] | undefined>;
}) => {
  const queryKey: HashtagsFollowingQueryKey = [
    "hashtags-following",
    queryParam,
  ];

  return useQuery({
    queryKey,
    queryFn: getHashtagsFollowing,
    retry: false,
    ...options,
  });
};
