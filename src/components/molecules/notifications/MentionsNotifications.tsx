import { useMentionsNotifications } from "@/hooks/queries/notifications/useMentionsNotifications";
import { cn } from "@/lib/utils";
import TimeAgo from "@/utils/helper/timeAgo";
import { AtSign, MessageSquareText } from "lucide-react";
import Link from "next/link";
import EmptyNotifications from "./EmptyNotifications";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { useLocale } from "@/providers/localeProvider";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { DisplayName } from "../common/DisplayName";
import Status from "@/components/organisms/status/Status";

const MentionsNotifications = () => {
  const {
    data: mentionsData,
    fetchNextPage: fetchNextMentions,
    hasNextPage: hasNextMentions,
    isFetchingNextPage: isFetchingNextMentions,
    isLoading,
  } = useMentionsNotifications();
  const {t} = useLocale();

  const loadMoreMentionsRef = useInfiniteScroll(() => {
    if (hasNextMentions && !isFetchingNextMentions) {
      fetchNextMentions();
    }
  });

  return (
    <div>
      {isLoading && (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      )}
      {mentionsData?.pages?.every?.((f) => f.data.length === 0) &&
        !isLoading && <EmptyNotifications />}
      {mentionsData?.pages.map((page) =>
        page.data.map((mention) => (
          <div
            key={mention.id}
            className="py-4 border-b-[0.5px] border-[#96A6C2] flex items-start gap-2"
          >
            <div className="text-orange-500 w-9 h-9 flex items-center justify-center">
              {mention?.status?.visibility === "direct" ? (
                <MessageSquareText size={20} />
              ) : (
                <AtSign size={20} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Link href={`/@${mention.account.acct}`}>
                  <img
                    src={mention.account.avatar}
                    alt={mention.account.username}
                    className="w-9 h-9 rounded-full mr-2"
                  />
                </Link>
                <div className="w-fit ms-auto flex items-end">
                  <span className="text-gray-400 text-sm">
                    <TimeAgo timestamp={mention.created_at} />
                  </span>
                </div>
              </div>
              <div className="my-1 flex items-baseline gap-1">
                <DisplayName
                  className="text-base inline-block"
                  emojis={mention.account.emojis}
                  displayName={
                    mention.account.display_name || mention.account.username
                  }
                  acct={mention.account.acct}
                />{" "}
                <span className="text-sm opacity-70">
                  {mention.status?.visibility === "direct" && t("notifications.private")}
                  {" "}{t("notifications.messages.mention")}
                </span>
              </div>
              {mention.status && (
                <Status
                  className={cn({
                    "bg-background border-1 border-gray-400":
                      mention.status.visibility === "direct",
                  })}
                  status={mention.status.reblog ?? mention.status}
                  preview
                />
              )}
            </div>
          </div>
        ))
      )}
      <div ref={loadMoreMentionsRef} />
      {isFetchingNextMentions && (
        <>
          <NotificationSkeleton />
        </>
      )}
    </div>
  );
};

export default MentionsNotifications;
