import { queryClient } from "@/providers/queryProvider";
import { useDeleteProfileMediaMutation } from "@/hooks/mutations/profile/useDeleteProfileMedia";
import { UpdateProfilePayload } from "@/types/profile";
import { AccountInfoQueryKey } from "@/types/queries/profile.type";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVerifyAuthToken } from "../useVerifyAuthToken.query";
import { useProfileMutation } from "./useProfile";
import { useLocale } from "@/providers/localeProvider";
import { useProfileMediaStore } from "@/stores/profile/useProfileMediaStore";

export const useEditProfile = () => {
  const {
    data: userInfo
  } = useVerifyAuthToken({ enabled: true });
  const { header, avatar, actions } = useProfileMediaStore();
  const { t } = useLocale();
  const [delConfAction, setDelConfAction] = useState<{
    visible: boolean;
    title?: "header" | "avatar";
  }>({ visible: false });

  useEffect(() => {
    if (userInfo) {
      actions.onSelectMedia(
        "avatar",
        userInfo?.avatar || userInfo.avatar_static
      );
      actions.onSelectMedia(
        "header",
        userInfo.header || userInfo.header_static
      );
    }
  }, [userInfo, actions]);

  const acctInfoQueryKey: AccountInfoQueryKey = [
    "get_account_info",
    { 
      id: userInfo.id,
      domain_name: process.env.API_URL ?? DEFAULT_API_URL 
    }
  ];

  const { mutateAsync, isPending: isUpdatingProfile } = useProfileMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: acctInfoQueryKey });
      queryClient.invalidateQueries({ queryKey: ["verify-auth-token"] });
      toast.success(t("toast.profile_updated"));
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    }
  });
  const { mutate: deleteMedia, isPending: isDeletingMedia } =
    useDeleteProfileMediaMutation({
      onSuccess: (response, variables) => {
        actions.onSelectMedia(variables.mediaType, []);
        actions.onToggleMediaModal(variables.mediaType);
        queryClient.invalidateQueries({ queryKey: acctInfoQueryKey });
        queryClient.invalidateQueries({ queryKey: ["verify-auth-token"] });
        toast.success(t("toast.media_deleted"));
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong!");
      }
    });

  const handleUpdateProfile = async () => {
    const payload: UpdateProfilePayload = {};

    payload.avatar =
      typeof avatar.selectedMedia === "string"
        ? avatar.selectedMedia
        : avatar.selectedMedia[0]?.uri ?? undefined;

    payload.header =
      typeof header.selectedMedia === "string"
        ? header.selectedMedia
        : header.selectedMedia[0]?.uri ?? undefined;
  };

  const handlePressDelConf = () => {
    if (delConfAction.title) {
      setDelConfAction({ visible: false });

      deleteMedia({ mediaType: delConfAction.title });
    }
  };

  return {
    userInfo,
    header,
    avatar,
    actions,
    top,
    delConfAction,
    mutateAsync,
    setDelConfAction,
    handleUpdateProfile,
    handlePressDelConf,
    isUpdatingProfile,
    isDeletingMedia
  };
};
