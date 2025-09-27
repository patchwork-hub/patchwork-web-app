
import { useGetEmailStatus } from "@/hooks/queries/notifications/useGetEmailStatus";
import { useUpdateEmail } from "@/hooks/mutations/notifications/useUpdateEmail";
import { useAuthStore } from "@/stores/auth/authStore";
import { useLocale } from "@/providers/localeProvider";
import { Switch } from "@/components/atoms/ui/switch";

export const ReceiveEmailNotification = () => {
  const { access_token } = useAuthStore();
  const { t } = useLocale();
  const { data: emailStatus } = useGetEmailStatus(!!access_token);
  const { mutate: updateEmailNoti } = useUpdateEmail();
  return (
    <li className="flex justify-between items-center">
      {t("setting.receive_email_notification")}
      <Switch
        checked={emailStatus?.data}
        onCheckedChange={(checked: boolean) => updateEmailNoti(checked)}
        className="data-[state=checked]:bg-orange-500 dark:data-[state=unchecked]:bg-gray-400/90"
        thumbClassName="dark:data-[state=checked]:bg-white"
      />
    </li>
  );
};
