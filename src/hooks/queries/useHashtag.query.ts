import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getHashtagsFollowing } from "@/services/home-feed/hashtagService";
import type { HashtagsFollowing } from "@/types/patchwork";
import type { HashtagsFollowingQueryKey } from "@/types/queries/hashtag.type";

type QueryOptions = Omit<
  UseQueryOptions<
    HashtagsFollowing[],
    AxiosError,
    HashtagsFollowing[],
    HashtagsFollowingQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useGetHashtagsFollowing = (
  queryParam: HashtagsFollowingQueryKey[1],
  options?: QueryOptions
): UseQueryResult<HashtagsFollowing[], AxiosError> => {
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