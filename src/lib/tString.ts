import { useLocale } from "@/providers/localeProvider";
export function useTString() {
  const { t } = useLocale();
  return (key: string, options?: Record<string, unknown>) => String(t(key, options));
}
