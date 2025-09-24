// src/hooks/community/useCommunityFavouriteActions.ts
import {
  favouriteCommunityChannelMutationFn,
  unfavoriteCommunityBySlugMutationFn
} from "@/services/community/toggleFavouriteChannelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFavouriteCommunityChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favouriteCommunityChannelMutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [
          "newsmast-channel-list",
          { instance_domain: variables.instance_domain }
        ]
      });

      const previousChannels = queryClient.getQueryData<ChannelList[]>([
        "newsmast-channel-list",
        { instance_domain: variables.instance_domain }
      ]);

      if (previousChannels) {
        queryClient.setQueryData(
          [
            "newsmast-channel-list",
            { instance_domain: variables.instance_domain }
          ],
          (old: any) =>
            old?.map((channel: any) => {
              if (channel.attributes.slug === variables.id) {
                return {
                  ...channel,
                  attributes: {
                    ...channel.attributes,
                    favourited: true // or false for unfavorite
                  }
                };
              }
              return channel;
            })
        );
      }

      return { previousChannels };
    },
    onError: (error, variables, context) => {
      if (context?.previousChannels) {
        queryClient.setQueryData(
          [
            "newsmast-channel-list",
            { instance_domain: variables.instance_domain }
          ],
          context.previousChannels
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "newsmast-channel-list",
          { instance_domain: variables.instance_domain }
        ]
      });
      queryClient.invalidateQueries({
        queryKey: ["favourite-channel-lists"]
      });
    }
  });
};

export const useUnFavouriteCommunityChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfavoriteCommunityBySlugMutationFn,
    onMutate: async (variables) => {
      const queryKey = [
        "newsmast-channel-list",
        { instance_domain: variables.instance_domain }
      ];

      await queryClient.cancelQueries({ queryKey });

      const previousChannels = queryClient.getQueryData(queryKey);

      if (previousChannels) {
        queryClient.setQueryData(queryKey, (old: any) =>
          old?.map((channel: any) =>
            channel.attributes.slug === variables.id
              ? {
                  ...channel,
                  attributes: {
                    ...channel.attributes,
                    favourited: false
                  }
                }
              : channel
          )
        );
      }

      return { previousChannels };
    },
    onError: (error, variables, context) => {
      if (context?.previousChannels) {
        queryClient.setQueryData(
          [
            "newsmast-channel-list",
            { instance_domain: variables.instance_domain }
          ],
          context.previousChannels
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "newsmast-channel-list",
          { instance_domain: variables.instance_domain }
        ]
      });
      queryClient.invalidateQueries({
        queryKey: ["favourite-channel-lists"]
      });
    }
  });
};
