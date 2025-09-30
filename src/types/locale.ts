import { Locale } from "@/lib/locale/i18n";


export type UserLocaleParams = {
  lang: Locale;
}

export type UserLocaleResponse = {
  message: string;
  data: {
    locale: Locale;
    message: string;
  };
}

export type ApiError = {
  message: string;
  code?: number;
  details?: unknown;
}

export type AxiosErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}