"use client";

import { ThemeText } from "@/components/atoms/common/ThemeText";
import { AccountListIcon } from "@/components/atoms/icons/Icons";
import { useHomeTimeline } from "@/hooks/queries/status/useHomeTimeline";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import useScrollRestoration from "@/hooks/scroll/useScrollRestoration";
import { cn } from "@/lib/utils";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";

export const CommunityTimeline: React.FC<{
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  local?: boolean;

  domain?: string;
}> = ({
  excludeReplies = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  remote = false,
  local = false,
  domain,
}) => {
  const { t } = useLocale();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useHomeTimeline({
      instanceUrl: domain,
      limit: 20,
      excludeReplies,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      local,
      isCommunity: true,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useScrollRestoration();

  const { theme } = useTheme();

  const hasStatuses = data?.pages.some((page) => page.statuses.length > 0);

  const { data: account } = useVerifyAuthToken({ enabled: true });

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  //! I want to show the statuses even if the account is not found
  //? I commented this out because it was causing the statuses to not be shown if the account is not found
  // return account && !isLoadingEmojis && !isLoading ? (
  return !isLoadingEmojis && !isLoading ? (
    <>
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
                  domain={domain}
                  key={uniqueKey}
                  status={status.reblog ?? status}
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
      </>
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
