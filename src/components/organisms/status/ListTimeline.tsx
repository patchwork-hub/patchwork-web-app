"use client";

import { useListTimeline } from "@/hooks/queries/status/useListTimeline";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import useScrollRestoration from "@/hooks/scroll/useScrollRestoration";
import { cn } from "@/lib/utils";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";
import { useLocale } from "@/providers/localeProvider";
import { AccountListIcon } from "@/components/atoms/icons/Icons";
import { useTheme } from "next-themes";
import { isSystemDark } from "@/utils/helper/helper";

export const ListTimeline: React.FC<{
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  remote?: boolean;
  id: string;
}> = ({
  excludeReplies = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  remote = false,
  id,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useListTimeline({
      limit: 20,
      excludeReplies,
      excludeReblogs,
      excludeOriginalStatuses,
      remote,
      id,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useScrollRestoration();
  const { t } = useLocale();
  const { theme } = useTheme();

  const { data: account } = useVerifyAuthToken({ enabled: true });

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return account && !isLoadingEmojis && !isLoading ? (
    <>
      <>
        {data?.pages[0].statuses.length > 0 ? (
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
                  ownStatus={account?.id === status.account.id}
                  className={cn({
                    "border-t-0": index === 0 && idx === 0,
                  })}
                />
              );
            })
          )
        ) : (
          <div className="p-4 flex flex-col justify-center items-center">
            <AccountListIcon  stroke={cn(theme === "dark" || (theme === "system" && isSystemDark) ? "#fff" : "#333")}/>
            <p>{t("common.no_statuses_found")}</p>
            <small className="max-w-xs text-center my-2">{t("list.list_empty_subtitle")}</small>
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
