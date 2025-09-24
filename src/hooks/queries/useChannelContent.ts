import {
  createChannelHashtag,
  getChannelContentType,
  getChannelFilterKeywordList,
  getChannelFilterOutKeywordList,
  getChannelHashtagList,
  getChannelPostsType,
  getContributorList,
  getMutedContributorList,
  getMyTotalChannelList,
  searchContributor
} from "@/services/settings/addChannelContent";
import {
  ChannelContentTypeQueryKey,
  ChannelFilterKeywordListQueryKey,
  ChannelFilterOutKeywordListQueryKey,
  ChannelHashtagListQueryKey,
  ChannelPostsTypeQueryKey,
  ContributorListQueryKey,
  GetMyTotalChannelListQueryKey,
  MutedContributorListQueryKey,
  SearchContributorQueryKey
} from "@/types/queries/channel.type";
import {
  useMutation,
  UseMutationOptions,
  useQuery
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetMyTotalChannelList = () => {
  const queryKey: GetMyTotalChannelListQueryKey = ["my-total-channel"];
  return useQuery({
    queryKey,
    queryFn: getMyTotalChannelList,
    staleTime: Infinity
  });
};

export const useGetContributorList = (channelId: string, enabled: boolean) => {
  const queryKey: ContributorListQueryKey = ["contributor-list", { channelId }];
  return useQuery({
    queryKey,
    queryFn: getContributorList,
    enabled
  });
};

export const useGetChannelHashtagList = (
  channelId: string,
  enabled: boolean
) => {
  const queryKey: ChannelHashtagListQueryKey = [
    "channel-hashtag-list",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelHashtagList,
    enabled
  });
};

export const useGetChannelFilterKeyword = (
  channelId: string,
  enabled: boolean
) => {
  const queryKey: ChannelFilterKeywordListQueryKey = [
    "channel-filter-keyword-list",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelFilterKeywordList,
    enabled
  });
};

export const useGetChannelContentType = (channelId: string) => {
  const queryKey: ChannelContentTypeQueryKey = [
    "channel-content-type",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelContentType
  });
};

export const useSearchContributor = ({
  keyword,
  enabled
}: {
  keyword: string;
  enabled: boolean;
}) => {
  const queryKey: SearchContributorQueryKey = [
    "search-contributor",
    { keyword }
  ];
  return useQuery({
    queryKey,
    queryFn: searchContributor,
    enabled
  });
};

export const useCreateChannelHashtagMutation = (
  options: UseMutationOptions<
    { message: string },
    AxiosError,
    {
      hashtag: string;
      channelId: string;
    }
  >
) => {
  return useMutation({ mutationFn: createChannelHashtag, ...options });
};

export const useGetMutedContributorList = (
  channelId: string,
  enabled: boolean
) => {
  const queryKey: MutedContributorListQueryKey = [
    "muted-contributor-list",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getMutedContributorList,
    enabled
  });
};

export const useGetChannelFilterOutKeyword = (
  channelId: string,
  enabled: boolean
) => {
  const queryKey: ChannelFilterOutKeywordListQueryKey = [
    "channel-filter-out-keyword-list",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelFilterOutKeywordList,
    enabled
  });
};

export const useGetChannelPostsType = (channelId: string) => {
  const queryKey: ChannelPostsTypeQueryKey = [
    "channel-posts-type",
    { channelId }
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelPostsType
  });
};
