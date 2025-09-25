"use client";

import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUpdateSettings } from "@/hooks/queries/useSetting.query";
import { SettingsParams } from "@/types/queries/setting.type";
import { cleanDomain, isSystemDark } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover";

export function ThemeSwitcher() {
  const { theme } = useTheme();
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const [open, setOpen] = useState(false);
  const { mutate: updateSettings } = useUpdateSettings({
    app_name: "newsmast",
    instance_domain: cleanDomain(domain),
  });

  const handleThemeChange = (themeValue: string) => {
    const validTheme = themeValue as "light" | "dark" | "system" | null;
    const themeType = validTheme === "system" ? null : validTheme;

    updateSettings({
      theme: { type: themeType },
    });
    setOpen(false);
  };
  const getDisplayTheme = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };
  const { t } = useLocale();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <div className="flex justify-between items-center cursor-pointer">
          <span>{t("setting.appearance_title")}</span>
          <div className="flex items-center bg-gray-600/70 px-2 py-1 rounded-md text-background dark:text-foreground">
            {getDisplayTheme()}
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-background text-foreground w-24 p-2 space-y-1"
      >
        <div
          className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-foreground/10 cursor-pointer"
          onClick={() => handleThemeChange("light")}
        >
          <Sun className="w-5 h-5" />
          {theme === "light" && <CircleCheck className="h-4 w-4" />}
        </div>
        <div
          className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-foreground/10 cursor-pointer"
          onClick={() => handleThemeChange("dark")}
        >
          <Moon className="w-5 h-5" />
          {theme === "dark" && <CircleCheck className="h-4 w-4" />}
        </div>
        <div
          className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-foreground/10 cursor-pointer"
          onClick={() => handleThemeChange("system")}
        >
          <Monitor className="w-5 h-5" />
          {theme === "system" && <CircleCheck className="h-4 w-4" />}
        </div>
      </PopoverContent>
    </Popover>
  );
}
