export type AppName = "patchwork" | "newsmast";
export type ThemeType = "light" | "dark" | null;

export interface ThemeSettings {
  type: ThemeType;
}

export interface UserSettings {
  theme: ThemeSettings;
}

export interface SettingsData {
  app_name: AppName;
  account_id: number;
  settings: UserSettings;
}

export interface SettingsResponse {
  data: SettingsData;
}

export interface SettingsParams {
  app_name: AppName;
  instance_domain?: string;
  token?: boolean | string;
}
