import { useLocale } from "@/providers/localeProvider";
interface TranslationOptions {
  [key: string]: string | number | boolean | undefined | null;
}
export function useTString() {
  const { t } = useLocale();
  return (key: string, options?: Record<string, unknown>) => String(t(key, options));
}
