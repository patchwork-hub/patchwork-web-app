import { useNewsmastTimeline } from "@/hooks/queries/status/useNewsmastTimeline";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import useScrollRestoration from "@/hooks/customs/useScrollRestoration";
import { cn } from "@/lib/utils";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";

export const NewsmastAccountStatusList: React.FC<{
  id: string;
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  excludeOriginalStatuses?: boolean;
}> = ({
  id,
  excludeReplies = false,
  excludeReblogs = false,
  excludeOriginalStatuses = false,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNewsmastTimeline(id as string, {
      limit: 20,
      excludeReplies,
      excludeReblogs,
      excludeOriginalStatuses,
    });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useScrollRestoration();

  const { data: account } = useVerifyAuthToken({ enabled: true });

  const { loading: isLoadingEmojis } = useCustomEmojiStore();

  return account && !isLoadingEmojis && !isLoading ? (
    <>
      <>
        {data?.pages.map((page, index) =>
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
                status={status.reblog ?? status}
                ownStatus={account?.id === status.account.id}
                className={cn({
                  "border-t-0": index === 0 && idx === 0,
                })}
              />
            );
          })
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
