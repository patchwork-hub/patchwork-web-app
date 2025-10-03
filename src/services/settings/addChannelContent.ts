import http from "@/lib/http";
import { ChannelContentAttribute, ChannelContentTpye, ChannelFilterKeyword, ChannelHashtag, ChannelList, ChannelPostType, ContributorList, SearchContributorRes } from "@/types/patchwork";
import {
  ChannelContentTypeQueryKey,
  ChannelFilterKeywordListQueryKey,
  ChannelFilterOutKeywordListQueryKey,
  ChannelHashtagListQueryKey,
  ChannelPostsTypeQueryKey,
  ContributorListQueryKey,
  MutedContributorListQueryKey,
  SearchContributorQueryKey
} from "@/types/queries/channel.type";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { handleError } from "@/utils/helper/helper";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const getMyTotalChannelList = async () => {
  try {
    const resp: AxiosResponse<{ data: ChannelList[] }> = await http.get(
      `/api/v1/channels`,
      {
        params: {
          domain_name:
            process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true
        }
      }
    );
    return resp.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getContributorList = async (
  qfContext: QueryFunctionContext<ContributorListQueryKey>
) => {
  const patchwork_community_id = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{ contributors: ContributorList[] }> =
    await http.get(`/api/v1/channels/contributor_list`, {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        page: 1,
        per_page: 100,
        patchwork_community_id
      }
    });
  return resp.data?.contributors;
};

export const getChannelHashtagList = async (
  qfContext: QueryFunctionContext<ChannelHashtagListQueryKey>
) => {
  const channelId = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{ data: ChannelHashtag[] }> = await http.get(
    `/api/v1/channels/${channelId}/community_hashtags`,
    {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        page: 1,
        per_page: 100
      }
    }
  );
  return resp.data?.data;
};

export const getChannelFilterKeywordList = async (
  qfContext: QueryFunctionContext<ChannelFilterKeywordListQueryKey>
) => {
  const channelId = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{
    data: ChannelFilterKeyword[];
  }> = await http.get(
    `/api/v1/channels/${channelId}/community_filter_keywords`,
    {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        page: 1,
        per_page: 100,
        filter_type: "filter_in"
      }
    }
  );
  return resp.data?.data;
};

export const getChannelContentType = async (
  qfContext: QueryFunctionContext<ChannelContentTypeQueryKey>
) => {
  const channelId = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{
    data: ChannelContentTpye[];
  }> = await http.get(`/api/v1/content_types`, {
    params: {
      domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
      isDynamicDomain: true,
      patchwork_community_id: channelId
    }
  });
  return resp.data?.data;
};

export const updateChannelContentType = async ({
  channel_type,
  custom_condition,
  patchwork_community_id
}: {
  channel_type: string;
  custom_condition: "and_condition" | "or_condition";
  patchwork_community_id: string;
}) => {
  try {
    const resp: AxiosResponse<{ data: ChannelContentAttribute }> =
      await http.post(
        `/api/v1/content_types`,
        {
          channel_type,
          custom_condition,
          patchwork_community_id
        },
        {
          params: {
            isDynamicDomain: true,
            domain_name: "https://dashboard.channel.org"
          }
        }
      );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const searchContributor = async (
  qfContext: QueryFunctionContext<SearchContributorQueryKey>
) => {
  const keyword = qfContext.queryKey[1].keyword;
  const resp: AxiosResponse<SearchContributorRes> = await http.get(
    "/api/v1/channels/search_contributor",
    {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        query: keyword
      }
    }
  );
  return resp.data;
};

export const removeOrUpdateHashtag = async ({
  hashtag,
  channelId,
  hashtagId,
  operation
}: {
  hashtag: string;
  channelId: string;
  hashtagId: string;
  operation: "edit" | "delete";
}) => {
  try {
    const url = `${
      process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL
    }/api/v1/channels/${channelId}/community_hashtags/${hashtagId}`;
    if (operation == "delete") {
      const resp: AxiosResponse<{ message: string }> = await http.delete(url);
      return resp.data;
    }
    const resp: AxiosResponse<{ message: string }> = await http.put(url, {
      community_hashtag: { hashtag }
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createChannelHashtag = async ({
  hashtag,
  channelId
}: {
  hashtag: string;
  channelId: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await http.post(
      `${
        process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL
      }/api/v1/channels/${channelId}/community_hashtags`,
      {
        community_hashtag: { hashtag }
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const removeOrUpdateFilterKeyword = async ({
  keyword,
  channelId,
  keywordId,
  operation,
  filter_type,
  is_filter_hashtag
}: {
  keyword: string;
  channelId: string;
  keywordId: string;
  filter_type: "filter_in" | "filter_out";
  operation: "edit" | "delete";
  is_filter_hashtag: boolean;
}) => {
  try {
    const url = `${
      process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL
    }/api/v1/channels/${channelId}/community_filter_keywords/${keywordId}`;
    if (operation == "delete") {
      const resp: AxiosResponse<{ message: string }> = await http.delete(url);
      return resp.data;
    }
    const resp: AxiosResponse<{ message: string }> = await http.put(url, {
      keyword,
      is_filter_hashtag,
      filter_type
    });
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addFilterInOutKeyword = async ({
  keyword,
  channelId,
  is_filter_hashtag,
  filter_type
}: {
  keyword: string;
  channelId: string;
  is_filter_hashtag: boolean;
  filter_type: "filter_in" | "filter_out";
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await http.post(
      `${
        process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL
      }/api/v1/channels/${channelId}/community_filter_keywords`,
      {
        keyword,
        is_filter_hashtag,
        filter_type
      }
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getMutedContributorList = async (
  qfContext: QueryFunctionContext<MutedContributorListQueryKey>
) => {
  const patchwork_community_id = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{ contributors: ContributorList[] }> =
    await http.get("/api/v1/channels/mute_contributor_list", {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        page: 1,
        per_page: 100,
        patchwork_community_id
      }
    });
  return resp.data?.contributors;
};

export const getChannelFilterOutKeywordList = async (
  qfContext: QueryFunctionContext<ChannelFilterOutKeywordListQueryKey>
) => {
  const channelId = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<{
    data: ChannelFilterKeyword[];
  }> = await http.get(
    `/api/v1/channels/${channelId}/community_filter_keywords`,
    {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        page: 1,
        per_page: 100,
        filter_type: "filter_out"
      }
    }
  );
  return resp.data?.data;
};

export const getChannelPostsType = async (
  qfContext: QueryFunctionContext<ChannelPostsTypeQueryKey>
) => {
  const channelId = qfContext.queryKey[1].channelId;
  const resp: AxiosResponse<ChannelPostType> = await http.get(
    `/api/v1/channels/${channelId}/community_post_types`,
    {
      params: {
        domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true
      }
    }
  );
  return resp.data;
};

export const updateChannelPostType = async ({
  posts,
  reposts,
  replies,
  channelId
}: {
  posts: boolean;
  reposts: boolean;
  replies: boolean;
  channelId: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await http.post(
      `/api/v1/channels/${channelId}/community_post_types`,
      {
        community_post_type: { posts, reposts, replies }
      },
      {
        params: {
          isDynamicDomain: true,
          domain_name: "https://dashboard.channel.org"
        }
      }
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};
