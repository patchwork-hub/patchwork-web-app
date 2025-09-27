
import { AccountListIcon } from "@/components/atoms/icons/Icons";
import { useAccountStatuses } from "@/hooks/queries/status/useAccountStatuses";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn } from "@/lib/utils";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import useScrollRestoration from "@/hooks/customs/useScrollRestoration";
import { ThemeText } from "@/components/molecules/common/ThemeText";

export const AccountStatusList: React.FC<{
  id: string;
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
  reblogAsOriginal?: boolean;
  onlyReblogs?: boolean;
}> = ({
  id,
  excludeReplies = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
  reblogAsOriginal = false,
  onlyReblogs = false,
}) => {
  const { t } = useLocale();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAccountStatuses(id as string, {
      limit: 20,
      excludeReplies,
      excludeReblogs,
      excludeOriginalStatuses,
      onlyReblogs,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useScrollRestoration();

  const { theme } = useTheme();

  const { data: account } = useVerifyAuthToken({ enabled: true });

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return !isLoadingEmojis && !isLoading ? (
    <>
      <>
        {data && data?.pages?.length > 0 &&
        !data?.pages?.every((page) => page.statuses.length === 0) ? (
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
                  direct={status?.visibility === "direct"}
                  key={uniqueKey}
                  status={reblogAsOriginal ? status.reblog ?? status : status}
                  ownStatus={account?.id === status.account.id}
                  showEdit={account?.id === status.account.id && !status.reblog}
                  className={cn({
                    "border-t-0": index === 0 && idx === 0,
                  })}
                />
              );
            })
          )
        ) : (
          <div className="flex flex-col items-center justify-center mt-12">
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
      <div ref={loadMoreRef} />
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
