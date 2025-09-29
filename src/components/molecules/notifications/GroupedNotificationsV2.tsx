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
import { useGroupedNotifications } from "@/hooks/queries/notifications/useGroupNotifications";
import EmptyNotifications from "./EmptyNotifications";
import { NotificationSkeleton } from "./NotificationSkeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/localeProvider";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { DisplayName } from "../common/DisplayName";
import Image from "next/image";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";


type GroupedNotificationsV2Props = {
  uri: string;
}

const GroupedNotificationsV2 = ({ uri }: GroupedNotificationsV2Props) => {
  const {
    data: groupNotificationsData,
    fetchNextPage: fetchNextGroupNotifications,
    hasNextPage: hasNextGroupNotifications,
    isFetchingNextPage: isFetchingNextGroupNotifications,
    isLoading,
  } = useGroupedNotifications();

  const { t } = useLocale();

  const loadMoreGroupNotificationsRef = useInfiniteScroll(() => {
    if (hasNextGroupNotifications && !isFetchingNextGroupNotifications) {
      fetchNextGroupNotifications();
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
      {groupNotificationsData?.pages?.every?.(
        (f) => f?.data?.notification_groups?.length === 0
      ) &&
        !isLoading && <EmptyNotifications />}
      {groupNotificationsData?.pages.map((page) =>
        page.data.notification_groups.map((groupNotification) => {
          const filteredAccounts =
            page.data.accounts?.filter((account) =>
              groupNotification.sample_account_ids?.includes(account.id)
            ) || [];
          const status = groupNotification.status_id
            ? page.data.statuses?.find(
                (s) => s.id === groupNotification.status_id
              )
            : null;

          return (
            <div
              key={groupNotification.group_key}
              className="py-4 border-b-[0.5px] border-[#96A6C2] flex items-start gap-2"
            >
              <div className="w-9 h-9 flex items-center justify-center text-orange-500">
                {groupNotification.type === "follow" && <UserPlus size={20} />}
                {groupNotification.type === "favourite" && <Star size={20} />}
                {groupNotification.type === "reblog" && <Repeat size={20} />}
                {groupNotification.type === "mention" &&
                  (status?.visibility === "direct" ? (
                    <MessageSquareText size={20} />
                  ) : (
                    <AtSign size={20} />
                  ))}
                {groupNotification.type === "update" && <History size={20} />}
                {groupNotification.type === "poll" && <NotepadText size={20} />}
              </div>
              <div className="flex-1">
                {groupNotification.type === "poll" ? (
                  <div className="flex items-center justify-between">
                    <p className="text-base opacity-80 my-1">
                      {filteredAccounts[0]?.uri === uri
                        ? `${t("poll.poll_ended")}`
                        : `${t("poll.poll_vote_ended")}`}
                    </p>
                    <span className="text-gray-400 text-sm">
                      <TimeAgo
                        timestamp={
                          groupNotification.latest_page_notification_at || ""
                        }
                      />
                    </span>
                  </div>
                ) : groupNotification.notifications_count === 1 ? (
                  <>
                    <div className="flex items-center">
                      <Link href={`/@${filteredAccounts[0]?.acct}`}>
                        <Image
                          src={filteredAccounts[0]?.avatar}
                          alt={filteredAccounts[0]?.username}
                          className="w-9 h-9 rounded-full mr-2"
                          width={36}
                          height={36}
                        />
                      </Link>
                      <div className="w-fit ms-auto flex items-end">
                        <span className="text-gray-400 text-sm">
                          <TimeAgo
                            timestamp={
                              groupNotification.latest_page_notification_at || ""
                            }
                          />
                        </span>
                      </div>
                    </div>
                    <div className="text-base my-1 flex items-baseline gap-1">
                      <DisplayName
                        emojis={filteredAccounts[0]?.emojis as MastodonCustomEmoji[]}
                        className="text-base inline-block"
                        displayName={
                          filteredAccounts[0]?.display_name ||
                          filteredAccounts[0]?.username
                        }
                        acct={filteredAccounts[0]?.acct}
                      />{" "}
                      <span className="text-sm opacity-70">
                        {groupNotification.type === "follow" &&
                          `${t("notifications.messages.follow")}`}
                        {groupNotification.type === "favourite" &&
                          `${t("notifications.messages.favourite")}`}
                        {groupNotification.type === "reblog" &&
                          `${t("notifications.messages.reblog")}`}
                        {groupNotification.type === "mention" &&
                          (status?.visibility === "direct"
                            ? `${t("notifications.private")}`
                            : " ") +
                            " " +
                            `${t("notifications.messages.mention")}`}
                        {groupNotification.type === "update" &&
                          `${t("notifications.messages.update")}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      {filteredAccounts.map((acc) => (
                        <Link key={acc.id} href={`/@${acc.acct}`}>
                          <Image
                            src={acc.avatar}
                            alt={acc.username}
                            className="w-9 h-9 rounded-full"
                            width={36}
                            height={36}
                          />
                        </Link>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-base opacity-80 my-1">
                        <DisplayName
                          emojis={filteredAccounts[0]?.emojis as MastodonCustomEmoji[]}
                          className="text-base inline-block"
                          displayName={
                            filteredAccounts[0]?.display_name ||
                            filteredAccounts[0]?.username
                          }
                          acct={filteredAccounts[0]?.acct}
                        />{" "}
                        <span className="text-sm opacity-70">
                          {groupNotification.notifications_count > 1 &&
                            `${t("notifications.andOthers", {
                              count: groupNotification.notifications_count,
                            })} ${
                              groupNotification.notifications_count === 1
                                ? "other"
                                : "others"
                            }`}{" "}
                          {groupNotification.type === "follow" &&
                            `${t("notifications.messages.follow")}`}
                          {groupNotification.type === "favourite" &&
                            `${t("notifications.messages.favourite")}`}
                          {groupNotification.type === "reblog" &&
                            `${t("notifications.messages.reblog")}`}
                          {groupNotification.type === "mention" &&
                            `${t("notifications.messages.mention")}`}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        <TimeAgo
                          timestamp={
                            groupNotification.latest_page_notification_at || ""
                          }
                        />
                      </span>
                    </div>
                  </>
                )}
                {status && (
                  <Status
                    className={cn({
                      "bg-background border-gray-400":
                        status?.visibility === "direct",
                    })}
                    status={status.reblog ?? status}
                    preview
                  />
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={loadMoreGroupNotificationsRef} />
      {isFetchingNextGroupNotifications && (
        <>
          <NotificationSkeleton />
        </>
      )}
    </div>
  );
};

export default GroupedNotificationsV2;
