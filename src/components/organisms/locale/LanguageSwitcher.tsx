"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CircleCheck, Loader2 } from "lucide-react";
import { useLocale } from "@/providers/localeProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUserLocale } from "@/hooks/mutations/locale/useUpdateUserLocale";
import {
  PREFERENCES_QUERY_KEY,
  useUserPreferences,
} from "@/hooks/mutations/locale/useUserPreferences";
import { getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/locale/i18n";
import { UserPreferences } from "@/types/preferences";

type Languages = {
  value: Locale;
  label: string;
  flag: string;
};

export const LANGUAGE_OPTIONS: Languages[] = [
  { value: "en" as Locale, label: "English", flag: "fi fi-us" },
  { value: "my" as Locale, label: "Myanmar", flag: "fi fi-mm" },
  { value: "ja" as Locale, label: " 日本語 - Japanese", flag: "fi fi-jp" },
  { value: "fr" as Locale, label: "Français - French", flag: "fi fi-fr" },
  { value: "cy" as Locale, label: "Cymraeg - Welsh", flag: "fi fi-gb" },
  {
    value: "pt-BR" as Locale,
    label: "Português - Portuguese (Brazil)",
    flag: "fi fi-br",
  },
  { value: "de" as Locale, label: "Deutsch - German", flag: "fi fi-de" },
  { value: "it" as Locale, label: "Italiano - Italian", flag: "fi fi-it" },
  { value: "es" as Locale, label: "Spanish", flag: "fi fi-es" },
];

type Props = {
  hasLangClicked?: boolean;
  label?: boolean;
}

export default function LanguageSwitcher({
  hasLangClicked,
  label = true,
}: Props) {
  const { locale: currentUiLocale, setLocale, t } = useLocale();
  const token = getToken();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(hasLangClicked);
  const { data: preferences, isLoading: isPreferencesLoading } =
    useUserPreferences(!!token);

  const { mutate: updateLocale, isPending: isUpdatingLocale } =
    useUpdateUserLocale({
      onSuccess: (data, variables) => {
        setLocale(variables.lang);

        queryClient.setQueryData([PREFERENCES_QUERY_KEY], (old: UserPreferences) => ({
          ...old,
          "posting:default:language": variables.lang,
        }));
      },
      onError: (error) => {
        console.error("Failed to update locale:", error);
        queryClient.invalidateQueries({ queryKey: [PREFERENCES_QUERY_KEY] });
      },
    });

  const currentLanguage =
    preferences?.data?.["posting:default:language"] || currentUiLocale;

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale !== currentLanguage && !isUpdatingLocale && token) {
      updateLocale({ lang: newLocale });
      setOpen(false);
    } else if (!token) {
      setLocale(newLocale);
      setOpen(false);
    }
  };

  const getFlag = useMemo(() => {
    return LANGUAGE_OPTIONS.find((item) => item.value === currentLanguage)
      ?.flag;
  }, [currentLanguage]);

  useEffect(() => {
    if (currentLanguage && currentLanguage !== currentUiLocale) {
      setLocale(currentLanguage as Locale);
    }
  }, [currentLanguage, currentUiLocale, setLocale]);

  const language = t("setting.appearance.language");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="w-full"
        disabled={isUpdatingLocale || isPreferencesLoading}
      >
        <div className="flex justify-between items-center cursor-pointer">
          {label && <span>{language}</span>}
          <div className="flex items-center bg-gray-600/70 px-2 py-1 rounded-md text-background dark:text-foreground">
            {isUpdatingLocale || isPreferencesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {/* {getLangName(currentLanguage)} */}
                <span className={cn("rounded-xs", getFlag)} />
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-background text-foreground w-fit p-2 space-y-1"
      >
        {isPreferencesLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            {LANGUAGE_OPTIONS.map(({ value, label, flag }) => (
              <div key={value}>
                <div
                  className={`flex justify-between items-center space-x-6 px-2 py-1.5 rounded hover:bg-foreground/10 cursor-pointer ${
                    isUpdatingLocale ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    !isUpdatingLocale && handleLanguageChange(value)
                  }
                >
                  <div className="text-slateDark dark:text-white flex items-center gap-4">
                    <span className={cn("rounded-xs", flag)} />
                    {label}
                  </div>
                  <div>
                    {currentLanguage === value && !isUpdatingLocale && (
                      <CircleCheck className="h-4 w-4" />
                    )}
                    {isUpdatingLocale && value === currentLanguage && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
