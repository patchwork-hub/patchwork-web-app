import {
  searchAllFn,
  searchChannelAndCommunity
} from "@/services/search/hashtag";
import {
  GetCommunityAndChannelSearchQueryKey,
  SearchAllQueryKey
} from "@/services/search/searchQuery";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { useQuery } from "@tanstack/react-query";

export const useSearchAllQueries = ({
  options,
  ...queryParam
}: SearchAllQueryKey[1] & {
  options?: QueryOptionHelper<SearchAll | undefined>;
}) => {
  const queryKey: SearchAllQueryKey = ["search-all", queryParam];
  return useQuery({
    queryKey,
    queryFn: searchAllFn,
    ...options
  });
};

export const useSearchChannelAndCommunity = ({
  searchKeyword,
  enabled = false
}: {
  searchKeyword: string;
  enabled?: boolean;
}) => {
  const queryKey: GetCommunityAndChannelSearchQueryKey = [
    "channel-community-search",
    { searchKeyword }
  ];
  return useQuery({
    queryKey,
    queryFn: searchChannelAndCommunity,
    enabled
  });
};
