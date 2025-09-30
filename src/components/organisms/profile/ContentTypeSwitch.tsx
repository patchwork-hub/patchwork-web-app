import { Switch } from "@/components/atoms/ui/switch";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import {
  updateChannelContentTypeCache,
  useChangeChannelContentType,
} from "@/hooks/mutations/profile/useChannelContent";
import { toast } from "sonner";

type ContentTypeSwitchProps = {
  isSwitchOn: boolean;
  channelId: string;
  label: string;
  type: "open" | "selected";
}

const ContentTypeSwitch = ({
  isSwitchOn,
  channelId,
  label,
  type,
}: ContentTypeSwitchProps) => {
  const { mutate } = useChangeChannelContentType({
    onMutate: ({ custom_condition }) => {
      updateChannelContentTypeCache(channelId, custom_condition);
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  return (
    <div className="flex items-center gap-3">
      <Switch
        className="data-[state=checked]:bg-orange-500 dark:data-[state=unchecked]:bg-gray-400/90"
        thumbClassName="dark:data-[state=checked]:bg-white"
        aria-label="Toggle between contributors or hashtags and contributors and hashtags"
        checked={isSwitchOn}
        onCheckedChange={() => {
          mutate({
            channel_type: "custom_channel",
            custom_condition:
              type === "open" ? "or_condition" : "and_condition",
            patchwork_community_id: channelId,
          });
        }}
      />
      <ThemeText>{label}</ThemeText>
    </div>
  );
};

export default ContentTypeSwitch;
