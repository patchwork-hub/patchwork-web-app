import { fetchSettings, updateSettings } from "@/services/theme/theme.service";
import {
  SettingsData,
  SettingsParams,
  SettingsResponse,
} from "@/types/queries/setting.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";

export const useSettings = (params: SettingsParams) => {
  return useQuery({
    queryKey: ["settings", params.app_name, params.instance_domain],
    queryFn: () => fetchSettings(params),
    enabled: !!params.token,
  });
};

export const useUpdateSettings = (params: SettingsParams) => {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();
  return useMutation({
    mutationFn: (settingsData: { theme: { type: "light" | "dark" | null } }) =>
      updateSettings(params, settingsData),
    onMutate: async (themeType) => {
      await queryClient.cancelQueries({
        queryKey: ["settings", params.app_name, params.instance_domain],
      });

      const previousSettings = queryClient.getQueryData<SettingsData>([
        "settings",
        params.app_name,
        params.instance_domain,
      ]);

      if (previousSettings) {
        queryClient.setQueryData<SettingsResponse>(
          ["settings", params.app_name, params.instance_domain],
          {
            data: {
              ...previousSettings,
              settings: {
                ...previousSettings.settings,
                theme: {
                  type: themeType.theme.type,
                },
              },
            },
          }
        );
      }

      setTheme(themeType.theme.type??"system");

      return { previousSettings };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", params.app_name, params.instance_domain],
      });
    },
    onError: (error) => {
      console.error("Failed to update settings:", error);
    },
  });
};
