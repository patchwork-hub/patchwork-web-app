import {
  trendingHashtagFn
} from "@/services/search/hashtag";
import {
  TrendingHashtagQueryKey
} from "@/types/queries/hashtag.type";
import {
  useQuery
} from "@tanstack/react-query";

export const useTrendingHashTagsQueries = () => {
  const queryKey: TrendingHashtagQueryKey = ["trending-hashtags"];
  return useQuery({
    queryKey,
    queryFn: trendingHashtagFn,
    staleTime: 1000 * 60 * 3
  });
};
