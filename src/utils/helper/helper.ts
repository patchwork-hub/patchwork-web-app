import { Field } from "@/types/auth";
import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DEFAULT_API_URL } from "../constant";
import { formatNumber } from "../formatNumber";

export const handleError = (error: unknown) => {
  const axiosError = error as {
    response?: {
      status?: number;
      data?: { error?: string; message?: string; errors?: string[] };
      message?: string;
    };
  };
  return Promise.reject({
    status: axiosError?.response?.status,
    message:
      axiosError?.response?.data?.error ||
      axiosError?.response?.data?.message ||
      axiosError?.response?.message ||
      axiosError?.response?.data?.errors?.[0] ||
      "Unknown error",
  });
};

export type QueryOptionHelper<
  TQueryFnData = unknown,
  TError = AxiosError,
  TData = TQueryFnData
> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn">;

export const truncateLongUrls = (desc: string) => {
  return desc.replace(/https?:\/\/[^\s]+/g, (url) => {
    if (url.length > 30) {
      return url.substring(0, 20) + "...";
    }
    return url;
  });
};
export const isSystemDark =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;

export const ensureHttp = (url: string) => {
  if (url && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
};
export const calculateHashTagCount = (
  hashTagList: HashtagHistory[],
  countType?: "accounts" | "uses"
) => {
  if (!Array.isArray(hashTagList)) return 0;
  return formatNumber(
    hashTagList.reduce(
      (accumulator: number, hashtag: HashtagHistory) =>
        accumulator + parseInt(hashtag[countType ?? "uses"]),
      0
    )
  );
};

export const checkIsAccountVerified = (fields?: Field[]) => {
  if (!fields || fields?.length < 1) return false;

  return fields.some(
    (field) => !!field.verified_at && field.verified_at.length > 1
  );
};

export const isAccFromChannelOrg = (acct: string, originInstsance: string) => {
  if (!acct) return false;
  const parts = acct.split("@");
  if (parts.length === 1) {
    return originInstsance == DEFAULT_API_URL;
  }
  return ensureHttp(parts[1]) === DEFAULT_API_URL;
};

export const cleanDomain = (domain: string): string => {
  if (!domain) return "";
  let cleaned = domain.replace(/^https?:\/\//i, "");
  cleaned = cleaned.replace(/\/+$/g, "");
  return cleaned;
};
export const formatSlug = (str: string): string => {
  return str?.replace(/-/g, "_") || "";
};

export const getUnreadNotificationCount = (
  notificationGroups: { most_recent_notification_id: string }[] = [],
  lastReadId: string | undefined | object
): number => {
  if (
    lastReadId &&
    typeof lastReadId === "object" &&
    Object.keys(lastReadId).length === 0
  ) {
    return notificationGroups.length;
  }

  if (!lastReadId) return 0;

  return notificationGroups.filter(
    (group) =>
      parseInt(group.most_recent_notification_id) >
      parseInt(lastReadId as string)
  ).length;
};

export const shouldShowMessageBadge = (
  message: { data?: { noti_type?: string; visibility?: string } } | null
): boolean => {
  return Boolean(
    message &&
      message?.data?.noti_type !== "mention" &&
      message?.data?.visibility !== "direct"
  );
};
