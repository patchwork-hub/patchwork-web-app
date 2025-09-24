import { Locale } from "@/lib/i18n";

export interface UserLocaleParams {
  lang: Locale;
}

export interface UserLocaleResponse {
  message: string;
  data: {
    locale: Locale;
    message: string;
  };
}

export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}

export interface AxiosErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}