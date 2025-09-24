import {
  fetchCommunityAbout,
  getChannelAdditionalInfo,
  getChannelDetail,
  getCommunityBio,
  getCommunityBioHashtags,
  getCommunityDetailProfile,
  getCommunityPeopleToFollow,
} from "@/services/community/communityAboutService";
import {
  GetChannelAboutQueryKey,
  GetChannelAdditionalInfoQueryKey,
  GetChannelDetailQueryKey,
  GetCommunityDetailQueryKey,
} from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useGetCommunityAbout = (domain_name: string) => {
  const queryKey: GetChannelAboutQueryKey = ["channel-about", { domain_name }];
  return useQuery({ queryKey, queryFn: fetchCommunityAbout });
};

export const useGetCommunityInfo = (domain_name: string) => {
  const queryKey: GetChannelAdditionalInfoQueryKey = [
    "channel-additional-info",
    { domain_name },
  ];
  return useQuery({
    queryKey,
    queryFn: getChannelAdditionalInfo,
    retry: false,
  });
};

export const useChannelDetail = ({ id }: { id: string }) => {
  const queryKey: GetChannelDetailQueryKey = ["channel-detail", { id }];
  return useQuery({
    queryKey,
    queryFn: getChannelDetail,
  });
};

export const useCommunityBio = ({
  slug,
  domain_name,
}: {
  slug: string;
  domain_name: string;
}) => {
  const queryKey = ["community-bio", { slug }];
  return useQuery({
    queryKey,
    queryFn: () => getCommunityBio(slug, domain_name),
   
  });
};

export const useCommunityBioHashtags = ({
  slug,
  domain_name,
  enabled
}: {
  slug: string;
  domain_name: string;
  enabled?: boolean
}) => {
  const queryKey = ["community-hashtags", { slug }];
  return useQuery({
    queryKey,
    queryFn: () => getCommunityBioHashtags(slug, domain_name),
    enabled: enabled
  });
};

export const useCommunityPeopleToFollow = ({
  slug,
  domain_name,
  enabled
}: {
  slug: string;
  domain_name: string;
  enabled?: boolean
}) => {
  const queryKey = ["community-people-to-follow", { slug }];
  return useQuery({
    queryKey,
    queryFn: () => getCommunityPeopleToFollow(slug, domain_name),
    enabled: enabled
  });
};

export const useCommunityDetailProfile = ({
  id,
  domain_name,
}: {
  id: string;
  domain_name: string;
}) => {
  const queryKey: GetCommunityDetailQueryKey = [
    "community-detail-profile",
    { id },
  ];
  return useQuery({
    queryKey,
    queryFn: () => getCommunityDetailProfile(id, domain_name),
  });
};
