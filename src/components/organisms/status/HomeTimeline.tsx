"use client";

import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import Status from "./Status";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useHomeTimeline } from "@/hooks/queries/status/useHomeTimeline";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { AccountListIcon } from "@/components/atoms/icons/Icons";
import { ThemeText } from "@/components/atoms/common/ThemeText";
import { cn } from "@/lib/utils";
import useScrollRestoration from "@/hooks/scroll/useScrollRestoration";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";
import { getToken } from "@/lib/auth";

export const HomeTimeline: React.FC<{
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  excludeDirect?: boolean;
  limit?: number;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  instanceUrl?: string;
  isCommunity?: boolean;
  onlyMedia?: boolean;
  local?: boolean;
}> = ({
  excludeReplies = false,
  limit = 20,
  excludeReblogs = false,
  excludeDirect = false,
  excludeOriginalStatuses = false,
  remote = false,
  instanceUrl,
  isCommunity = false,
  onlyMedia = false,
  local = false,
}) => {
  const { t } = useLocale();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useHomeTimeline({
      limit,
      excludeReplies,
      excludeDirect,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      instanceUrl,
      isCommunity,
      onlyMedia,
      local,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const hasStatuses = data?.pages.some((page) => page.statuses.length > 0);
  const token = getToken()

  const { data: account } = useVerifyAuthToken({ enabled: !!token });

  useScrollRestoration();

  const { theme } = useTheme();

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return !isLoadingEmojis && !isLoading ? (
    <>
      {hasStatuses ? (
        data?.pages.map((page, index) =>
          page.statuses.map((status, idx) => {
            {
              /* uniqueKey is to rerender after invalidateQueries */
            }
            const uniqueKey = `status-${status.id}-${status.content.length}-${
              status.reblog ? status.reblog.content.length : ""
            }`;

            return (
              <Status
                key={uniqueKey}
                status={status}
                showEdit
                ownStatus={account?.id === status.account.id}
                className={cn({
                  "border-t-0": index === 0 && idx === 0,
                })}
              />
            );
          })
        )
      ) : (
        <div className="flex flex-col items-center justify-center">
          <AccountListIcon
            stroke={cn(
              theme === "dark" || (theme === "system" && isSystemDark)
                ? "#fff"
                : "#333"
            )}
          />
          <ThemeText variant="textBold">
            {t("common.no_statuses_found")}
          </ThemeText>
        </div>
      )}
      <div ref={loadMoreRef}></div>
      {isFetchingNextPage && (
        <div className="p-4 border-t border-t-gray-400">
          <StatusSkeleton />
        </div>
      )}
    </>
  ) : (
    <div className="p-4">
      <StatusSkeleton />
    </div>
  );
};
