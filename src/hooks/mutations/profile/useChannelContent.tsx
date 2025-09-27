import { queryClient } from "@/providers/queryProvider";
import {
  addFilterInOutKeyword,
  removeOrUpdateFilterKeyword,
  removeOrUpdateHashtag,
  updateChannelContentType,
  updateChannelPostType
} from "@/services/settings/addChannelContent";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useChangeChannelContentType = (
  options: UseMutationOptions<
    { data: ChannelContentAttribute },
    AxiosError,
    {
      channel_type: string;
      custom_condition: "and_condition" | "or_condition";
      patchwork_community_id: string;
    }
  >
) => {
  return useMutation({ mutationFn: updateChannelContentType, ...options });
};

export const updateChannelContentTypeCache = (
  channelId: string,
  custom_condition: "and_condition" | "or_condition"
) => {
  const queryKey = ["channel-content-type", { channelId }];
  const previousData = queryClient.getQueryData<ChannelContentTpye[]>(queryKey);
  if (previousData) {
    const updatedData: ChannelContentTpye[] = previousData.map((item) => {
      return {
        ...item,
        attributes: {
          ...item.attributes,
          custom_condition
        }
      };
    });
    queryClient.setQueryData(queryKey, updatedData);
  }
};

export const useRemoveOrUpdateHashtag = (
  options: UseMutationOptions<
    { message: string },
    AxiosError,
    {
      hashtag: string;
      channelId: string;
      hashtagId: string;
      operation: "edit" | "delete";
    }
  >
) => {
  return useMutation({ mutationFn: removeOrUpdateHashtag, ...options });
};

export const useRemoveOrUpdateFilterKeyword = (
  options: UseMutationOptions<
    { message: string },
    AxiosError,
    {
      keyword: string;
      channelId: string;
      keywordId: string;
      filter_type: "filter_in" | "filter_out";
      operation: "edit" | "delete";
      is_filter_hashtag: boolean;
    }
  >
) => {
  return useMutation({ mutationFn: removeOrUpdateFilterKeyword, ...options });
};

export const useFilterInOutMutation = (
  options: UseMutationOptions<
    { message: string },
    AxiosError,
    {
      keyword: string;
      channelId: string;
      is_filter_hashtag: boolean;
      filter_type: "filter_in" | "filter_out";
    }
  >
) => {
  return useMutation({ mutationFn: addFilterInOutKeyword, ...options });
};

export const useChangeChannelPostsType = (
  options: UseMutationOptions<
    { message: string },
    AxiosError,
    {
      posts: boolean;
      reposts: boolean;
      replies: boolean;
      channelId: string;
    }
  >
) => {
  return useMutation({ mutationFn: updateChannelPostType, ...options });
};
