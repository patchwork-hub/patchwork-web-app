import {
  Star,
  Repeat,
  AtSign,
  UserPlus,
  History,
  NotepadText,
  MessageSquareText,
} from "lucide-react";
import Status from "@/components/organisms/status/Status";
import TimeAgo from "@/utils/helper/timeAgo";
import { useNotifications } from "@/hooks/queries/notifications/useNotifications";
import EmptyNotifications from "./EmptyNotifications";
import { NotificationSkeleton } from "./NotificationSkeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/localeProvider";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { DisplayName } from "../common/DisplayName";
import Image from "next/image";

const GroupedNotificationsV1 = () => {
  const {
    data: notificationsData,
    fetchNextPage: fetchNextNotifications,
    hasNextPage: hasNextNotifications,
    isFetchingNextPage: isFetchingNextNotifications,
    isLoading,
  } = useNotifications();
  const {t} = useLocale();

  const loadMoreNotificationsRef = useInfiniteScroll(() => {
    if (hasNextNotifications && !isFetchingNextNotifications) {
      fetchNextNotifications();
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
      {notificationsData?.pages?.every?.((f) => f.data.length === 0) &&
        !isLoading && <EmptyNotifications />}
      {notificationsData?.pages.map((page) =>
        page.data.map((notification) => (
          <div
            key={notification.id}
            className="py-4 border-b-[0.5px] border-[#96A6C2] flex items-start gap-2"
          >
            <div className="w-9 h-9 flex items-center justify-center text-orange-500">
              {notification.type === "follow" && <UserPlus size={20} />}
              {notification.type === "favourite" && <Star size={20} />}
              {notification.type === "reblog" && <Repeat size={20} />}
              {notification.type === "mention" &&
                (notification?.status?.visibility === "direct" ? (
                  <MessageSquareText size={20} />
                ) : (
                  <AtSign size={20} />
                ))}
              {notification.type === "update" && <History size={20} />}
              {notification.type === "poll" && <NotepadText size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Link href={`/@${notification.account.acct}`}>
                  <Image
                    src={notification.account.avatar}
                    alt={notification.account.username}
                    className="w-9 h-9 rounded-full mr-2"
                  />
                </Link>
                <div className="w-fit ms-auto flex items-end">
                  <span className="text-gray-400 text-sm">
                    <TimeAgo timestamp={notification.created_at} />
                  </span>
                </div>
              </div>
              <div className="my-1 flex items-baseline gap-1">
                <DisplayName
                  emojis={notification.account.emojis}
                  displayName={
                    notification.account.display_name ||
                    notification.account.username
                  }
                  acct={notification.account.acct}
                  className="text-base inline-block"
                />
                <span className="text-sm opacity-70">
                  {notification.type === "follow" && `${t("notifications.messages.follow")}`}
                  {notification.type === "favourite" && "favorited your post"}
                  {notification.type === "reblog" && "boosted your post"}
                  {notification.type === "mention" &&
                    (notification.status?.visibility === "direct"
                      ? "privately "
                      : "") + "mentioned you"}
                  {notification.type === "update" && "updated their post"}
                </span>
              </div>
              {notification.status && (
                <Status
                  className={cn("border-gray-400", {
                    "bg-[rgb(243,246,255)]":
                      notification.status?.visibility === "direct",
                  })}
                  status={notification.status.reblog ?? notification.status}
                  preview
                />
              )}
            </div>
          </div>
        ))
      )}
      <div ref={loadMoreNotificationsRef} />
      {isFetchingNextNotifications && (
        <>
          <NotificationSkeleton />
        </>
      )}
    </div>
  );
};

export default GroupedNotificationsV1;
