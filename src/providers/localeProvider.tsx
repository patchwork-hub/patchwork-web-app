"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  defaultLocale,
  getTranslations,
  Locale,
  locales,
  Translations,
} from "@/lib/locale/i18n";
import { useGetCommunityAbout } from "@/hooks/queries/useGetChannelAbout.query";
import Cookies from "js-cookie";
import { DEFAULT_API_URL } from "@/utils/constant";

type PathsToStringProps<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object
        ? `.${PathsToStringProps<T[K]> & string}`
        : ""}`;
    }[keyof T]
  : never;

type TranslationKey = PathsToStringProps<Translations>;

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    key: TranslationKey | string,
    options?: Record<string, unknown> & {
      components?: Record<string, (chunks: React.ReactNode) => React.ReactNode>;
    }
  ) => string | React.ReactNode;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>();
  const [isMounted, setIsMounted] = useState(false);
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { data: Instance, isLoading } = useGetCommunityAbout(domain);

  useEffect(() => {
    setIsMounted(true);

    // First check localStorage
    const saved = localStorage.getItem("patchwork-lang");
    if (saved && locales.includes(saved as Locale)) {
      setLocale(saved as Locale);
      return;
    }

    // If instance data is available, use it
    if (Instance?.languages?.[0] && locales.includes(Instance.languages[0] as Locale)) {
      setLocale(Instance.languages[0] as Locale);
      return;
    }

    // Only set default if we're not still loading
    if (!isLoading) {
      setLocale(defaultLocale);
    }
  }, [Instance, isLoading]); // This will re-run when Instance changes from undefined to having data

  useEffect(() => {
    if (locale) {
      localStorage.setItem("patchwork-lang", locale);
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const getNestedTranslation = (obj: Record<string, unknown>, path: string): string => {
    return path.split(".").reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj) as string || path;
  };

  const t = (
    key: TranslationKey | string,
    options?: Record<string, unknown> & {
      components?: Record<string, (chunks: React.ReactNode) => React.ReactNode>;
    }
  ): string | React.ReactNode => {
    if (!locale) return typeof key === "string" ? key : "";

    const translations = getTranslations(locale);
    let translation = getNestedTranslation(translations, key);

    if (typeof translation !== "string") {
      console.warn(`Translation key "${key}" not found or not a string`);
      return key;
    }

    const { components, ...vars } = options || {};
    if (vars) {
      translation = Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, "g"), String(v)),
        translation
      );
    }

    if (!components) {
      return translation;
    }

    const parts: React.ReactNode[] = [];
    const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(translation)) !== null) {
      const [full, tagName, inner] = match;
      const before = translation.slice(lastIndex, match.index);
      if (before) parts.push(before);

      if (components[tagName]) {
        parts.push(components[tagName](inner));
      } else {
        parts.push(inner);
      }

      lastIndex = match.index + full.length;
    }

    if (lastIndex < translation.length) {
      parts.push(translation.slice(lastIndex));
    }

    return parts;
  };

  if (!isMounted || !locale) {
    return (
      <LocaleContext.Provider
        value={{
          locale: defaultLocale,
          setLocale: () => {},
          t: (key) => (typeof key === "string" ? key : ""),
        }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}