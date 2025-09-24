import { app } from "@/firebase/config";
import http from "@/lib/http";
import { SettingsParams, SettingsResponse } from "@/types/queries/setting.type";

export const fetchSettings = async (
  params: SettingsParams
): Promise<SettingsResponse> => {
  const response = await http.get<SettingsResponse>(`/api/v1/settings`, {
    params: {
      domain_name: process.env.NEXT_PUBLIC_DASHBOARD_API_URL,
      isDynamicDomain: true,
      app_name: params.app_name,
      instance_domain: params.instance_domain,
    },
  });
  return response.data;
};

export const updateSettings = async (
  params: SettingsParams,
  settingsData: { theme: { type: "light" | "dark" | null } }
): Promise<SettingsResponse> => {
  const response = await http.post<SettingsResponse>(
    `/api/v1/settings/upsert`,
    {
      app_name: params.app_name,
      settings: settingsData,
    },
    {
      params: {
        domain_name: process.env.NEXT_PUBLIC_DASHBOARD_API_URL,
        isDynamicDomain: true,
        instance_domain: params.instance_domain,
      },
    }
  );
  return response.data;
};
