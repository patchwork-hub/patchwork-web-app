export type AppName = "patchwork" | "newsmast";
export type ThemeType = "light" | "dark" | null;

export type ThemeSettings = {
  type: ThemeType;
}

export type UserSettings = {
  theme: ThemeSettings;
}

export type SettingsData = {
  app_name: AppName;
  account_id: number;
  settings: UserSettings;
}

export type SettingsResponse = {
  data: SettingsData;
}

export type SettingsParams = {
  app_name: AppName;
  instance_domain?: string;
  token?: boolean | string;
}
