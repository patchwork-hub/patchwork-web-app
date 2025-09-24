import { setPrimaryChannel } from "@/services/community/primaryChannelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SetPrimaryChannelOptions {
  id: string;
  instance_domain?: string;
  platform_type?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useSetPrimaryChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPrimaryChannel,
    onMutate: async (newPrimary: SetPrimaryChannelOptions) => {
      await queryClient.cancelQueries({
        queryKey: [
          "newsmast-channel-list",
          { instance_domain: newPrimary.instance_domain },
        ],
      });

      const previousChannels = queryClient.getQueryData<ChannelList[]>([
        "newsmast-channel-list",
        { instance_domain: newPrimary.instance_domain },
      ]);

      if (previousChannels) {
        queryClient.setQueryData(
          [
            "newsmast-channel-list",
            { instance_domain: newPrimary.instance_domain },
          ],
          (old: any) =>
            old?.map((channel) => ({
              ...channel,
              attributes: {
                ...channel.attributes,
                is_primary: channel.attributes.slug === newPrimary.id,
              },
            }))
        );
      }

      return { previousChannels };
    },
    onError: (err, newPrimary, context) => {
      if (context?.previousChannels) {
        queryClient.setQueryData(
          [
            "newsmast-channel-list",
            { instance_domain: newPrimary.instance_domain },
          ],
          context.previousChannels
        );
      }
    },
    onSettled: (data, error, variables) => {
      // queryClient.invalidateQueries({
      //   queryKey: [
      //     "newsmast-channel-list",
      //     { instance_domain: variables.instance_domain },
      //   ],
      // });
    },
  });
};
