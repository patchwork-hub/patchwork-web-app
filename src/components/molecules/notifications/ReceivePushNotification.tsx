import { Switch } from "@/components/atoms/ui/switch";
import { useUpdateMute } from "@/hooks/mutations/notifications/useUpdateMute";
import { useGetMuteStatus } from "@/hooks/queries/notifications/useGetMuteStatus";
import { useLocale } from "@/providers/localeProvider";

export const ReceivePushNotification = () => {
  const { data: muteStatus } = useGetMuteStatus();
  const {t} = useLocale()
  const { mutate: updateMute } = useUpdateMute();
  return (
    <li className="flex justify-between items-center">
      {t("setting.receive_push_notification")}
      <Switch
        checked={!muteStatus?.mute}
        onCheckedChange={(checked: boolean) => updateMute(!checked)}
        className="data-[state=checked]:bg-orange-500 dark:data-[state=unchecked]:bg-gray-400/90"
        thumbClassName="dark:data-[state=checked]:bg-white"
      />
    </li>
  );
};
