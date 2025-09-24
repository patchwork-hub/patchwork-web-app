import axiosInstance from "@/lib/http";
import {
  CommunityAccountResponse,
  CommunityBio,
  HashtagTimelineResponse,
} from "@/types/community";
import {
  GetChannelAboutQueryKey,
  GetChannelAdditionalInfoQueryKey,
  GetChannelDetailQueryKey,
  GetCommunityDetailQueryKey,
} from "@/types/queries/channel.type";
import { CHANNEL_ORG_INSTANCE, DEFAULT_API_URL, DEFAULT_DASHBOARD_API_URL, MASTODON_INSTANCE, MOME_INSTANCE, userOriginInstanceDomain } from "@/utils/constant";
import { cleanDomain, ensureHttp } from "@/utils/helper/helper";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { remove } from "lodash";

export const fetchCommunityAbout = async (
  qfContext: QueryFunctionContext<GetChannelAboutQueryKey>
) => {
  const { domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<ChannelAbout> = await axiosInstance.get(
    `/api/v2/instance`,
    {
      params: { domain_name, isDynamicDomain: true },
    }
  );
  return resp.data;
};

export const getChannelAdditionalInfo = async (
  qfContext: QueryFunctionContext<GetChannelAdditionalInfoQueryKey>
) => {
  const { domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<ChannelAdditionalInfo> = await axiosInstance.get(
    "/api/v1/instance/extended_description",

    {
      params: { domain_name, isDynamicDomain: true },
    }
  );
  return resp.data;
};

export const getChannelDetail = async (
  qfContext: QueryFunctionContext<GetChannelDetailQueryKey>
) => {
  const domain = Cookies.get("domain");
  const id = qfContext.queryKey[1].id;
  const params: Record<string, any> = { 
    domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL, 
    isDynamicDomain: true ,
    id
  };
  if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
    params.instance_domain = cleanDomain(userOriginInstanceDomain);
  }
  const resp: AxiosResponse<{ data: ChannelList }> = await axiosInstance.get(
    "api/v1/channels/channel_detail",
    { params }
  );
  return resp.data.data;
};

export const getCommunityBio = async (slug: string, domain_name: string) => {
  const resp: AxiosResponse<CommunityBio> = await axiosInstance.get(
    `/api/v1/communities/${slug}/community_bio`,
    {
      params: {
        domain_name: domain_name,
        isDynamicDomain: true,
      },
    }
  );
  return resp.data;
};

export const getCommunityBioHashtags = async (
  slug: string,
  domain_name: string
) => {
  const params: Record<string, any> = { 
      domain_name, 
      isDynamicDomain: true ,
    };
    if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
      params.instance_domain = cleanDomain(userOriginInstanceDomain);
    }
  const resp: AxiosResponse<HashtagTimelineResponse> = await axiosInstance.get(
    `/api/v1/channels/hashtag_list?page=1&per_page=100&patchwork_community_id=${slug}`,
    { params }
  );
  return resp.data;
};

export const getCommunityPeopleToFollow = async (
  slug: string,
  domain_name: string
) => {
  const params: Record<string, any> = { 
      domain_name, 
      isDynamicDomain: true ,
    };
    if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
      params.instance_domain = cleanDomain(userOriginInstanceDomain);
    }
  const resp: AxiosResponse<CommunityAccountResponse> = await axiosInstance.get(
    `/api/v1/channels/contributor_list?page=1&per_page=100&patchwork_community_id=${slug}`,
    { params }
  );
  return resp.data;
};

export const getCommunityDetailProfile = async (
  id: string,
  domain_name: string
) => {
  const params: Record<string, any> = { 
      domain_name, 
      isDynamicDomain: true ,
    };
    if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
      params.instance_domain = cleanDomain(userOriginInstanceDomain);
    }
  const resp: AxiosResponse<{ data: ChannelList }> = await axiosInstance.get(
    `/api/v1/channels/channel_detail?id=${id}`,
    { params }
  );

  return resp.data.data;
};
