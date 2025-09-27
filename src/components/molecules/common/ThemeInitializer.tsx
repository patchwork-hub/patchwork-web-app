"use client";

import { useTheme } from "next-themes";
import { useSettings } from "@/hooks/queries/useSetting.query";
import { cleanDomain } from "@/utils/helper/helper";
import { DEFAULT_API_URL } from "@/utils/constant";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { getToken } from "@/stores/auth";

export default function ThemeInitializer() {
  const { setTheme } = useTheme();
  const token = getToken();
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;

  const { data: appSettings } = useSettings({
    app_name: "newsmast",
    instance_domain: cleanDomain(domain),
    token: token,
  });

  useEffect(() => {
    if (appSettings?.data?.settings?.theme) {
      const themeType = appSettings.data.settings.theme.type;
      setTheme(themeType === null ? "system" : themeType);
    }
  }, [appSettings?.data?.settings?.theme, setTheme]);

  return null;
}
