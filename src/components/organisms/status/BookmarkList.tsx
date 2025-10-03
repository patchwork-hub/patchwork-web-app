import { useBookmarkList } from "@/hooks/queries/useBookmarkList";
import { cn } from "@/lib/utils";
import { StatusSkeleton } from "../../molecules/skeletons/Status.Skeleton";
import { useCustomEmojiStore } from "../compose/store/useCustomEmojiStore";
import Status from "./Status";
import { cleanDomain } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import useScrollRestoration from "@/hooks/customs/useScrollRestoration";
import { Status as StatusType } from "@/types/status";
export const BookmarkList: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBookmarkList();

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });
  const domain_name = Cookies.get("domain");
  useScrollRestoration();

  const { loading: isLoadingEmojis } = useCustomEmojiStore();
  console.log("newsmast.social", domain_name);
  return !isLoadingEmojis && !isLoading ? (
    <>
      <>
        {(("newsmast.social" === cleanDomain(domain_name ?? "")
          ? data?.pages[0]?.statuses
          : data?.pages[0]?.statuses
        )?.length ?? 0) > 0 ? (
          data?.pages?.map((page, index) => {
            const statusesArray =
              "newsmast.social" === cleanDomain(domain_name ?? "")
                ? page?.statuses
                : page?.statuses;

            return statusesArray?.map((status: StatusType, idx: number) => {
              const uniqueKey = `status-${status.id}-${status.content.length}-${
                status.reblog ? status.reblog.content.length : ""
              }`;

              return (
                <Status
                  direct={status?.visibility === "direct"}
                  key={uniqueKey}
                  status={status}
                  className={cn({
                    "border-t-0": index === 0 && idx === 0,
                  })}
                />
              );
            });
          })
        ) : (
          <div className="p-4 flex justify-center items-center">
            <p>No bookmarks found</p>
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
