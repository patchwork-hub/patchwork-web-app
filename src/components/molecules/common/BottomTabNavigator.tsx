"use client";
import { cn } from "@/lib/utils";
import { Bell, Home, Mail, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LinkStatus } from "../common/LinkStatus";
import { useDraftStore } from "../../organisms/compose/store/useDraftStore";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import { useGroupedNotifications } from "@/hooks/queries/notifications/useGroupNotifications";
import { useNotificationMarker } from "@/hooks/queries/notifications/useNotificationMarket";
import Cookies from "js-cookie";
import {
  cleanDomain,
  getUnreadNotificationCount,
  shouldShowMessageBadge,
} from "@/utils/helper/helper";
import { MOME_INSTANCE } from "@/utils/constant";
import { useSaveLastReadIdNotification } from "@/hooks/mutations/notifications/useSaveLastReadIdNotification";
import { useModalAction } from "@/components/organisms/modal/modal.context";
import { useScheduleStore } from "@/components/organisms/compose/store/useScheduleStore";
import { useSearchStore } from "@/stores/search/useSearchStore";
import useLoggedIn from "@/stores/auth/useLoggedIn";

import { useAuthStoreAction } from "@/stores/auth/authStore";
import { getToken } from "@/stores/auth";
import { Button } from "@/components/atoms/ui/button";
import { NotificationGroup } from "@/types/notification";
import { TabNavigator } from "@/types/patchwork";
import { useLocale } from "@/providers/localeProvider";

type FCMessageData = {
  noti_type?: string;
  visibility?: string;
};

type FCMessage = {
  data?: FCMessageData;
};

const NotificationIcon = ({
  pathname,
  lastReadId,
  notificationGroups = [],
  message,
}: {
  pathname: string;
  lastReadId?: string | object;
  notificationGroups?: NotificationGroup[];
  message?: FCMessage | null;
}) => {
  const unreadCount = getUnreadNotificationCount(
    notificationGroups,
    lastReadId
  );
  const hasMessageBadge = shouldShowMessageBadge(message ?? null);
  const showBadge =
    pathname !== "/notifications" && (hasMessageBadge || unreadCount > 0);
  const displayCount = unreadCount > 20 ? "20+" : unreadCount;

  return (
    <div className="relative">
      <Bell
        size={24}
        className={`text-[#96A6C2] ${
          pathname === "/notifications" ? "stroke-[2.5]" : "stroke-2"
        }`}
      />
      {showBadge && (
        <span
          className={cn(
            "absolute flex items-center justify-center bg-orange-500 rounded-full text-white",
            unreadCount > 0
              ? "min-w-5 h-5 -top-2 -right-2 text-xs px-1"
              : "top-0 right-0 w-2 h-2"
          )}
        >
          {unreadCount > 0 ? displayCount : null}
        </span>
      )}
    </div>
  );
};

const BottomTabNavigator = () => {
  const pathname = usePathname();
  const router = useRouter();
  const domain = Cookies.get("domain");
  const isLoggedIn = useLoggedIn();
  const { t } = useLocale();
  const { setSignInWithMastodon } = useAuthStoreAction();

  const { openModal } = useModalAction();
  const { removeSchedule } = useScheduleStore();
  const { setSearch } = useSearchStore();
  const token = getToken();

  const isNewsmast = domain === cleanDomain(MOME_INSTANCE);

  const { data: notificationMarker } = useNotificationMarker({
    enabled: !isNewsmast && !!token,
  });
  const { data: groupNotificationsData } = useGroupedNotifications({
    enabled: !isNewsmast && !!token,
  });

  const { mutate: saveLastReadId } = useSaveLastReadIdNotification();

  const handleNotificationRead = (notificationId: string) => {
    saveLastReadId(notificationId as string);
  };

  const { isDirty, setSaveAsDraftModalOpen, setNavigateAction } =
    useDraftStore();

  const { message } = useFCMStore();
  const lastReadId = notificationMarker?.notifications?.last_read_id || {};
  const notificationGroups =
    groupNotificationsData?.pages?.[0]?.data?.notification_groups;

  const tabs: TabNavigator[] = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "plus", icon: Plus, label: "Create", path: "/create-status" },
    {
      id: "notifications",
      icon: () => (
        <NotificationIcon
          pathname={pathname}
          lastReadId={lastReadId}
          notificationGroups={notificationGroups}
          message={message as FCMessage | null}
        />
      ),
      label: "Notifications",
      path: "/notifications",
    },
    {
      id: "mail",
      icon: () => (
        <div className="relative">
          <Mail
            size={24}
            className={`text-[#96A6C2] ${
              pathname === "/notifications" ? "stroke-[2.5]" : "stroke-2"
            }`}
          />
          {Boolean(
            pathname !== "/notifications" &&
              message &&
              (message as FCMessage)?.data?.noti_type === "mention" &&
              (message as FCMessage)?.data?.visibility === "direct"
          ) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" />
          )}
        </div>
      ),
      label: "Messages",
      path: "/conversations",
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gray-600 z-50">
      <div className="flex justify-around items-center w-full mx-auto py-2 px-4 sm:px-6">
        {isLoggedIn ? (
          tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            const isPlus = tab.id === "plus";

            return (
              <Link
                key={tab.id}
                href={!isPlus ? tab.path : ""}
                onClick={() => setSearch("")}
                onNavigate={(e) => {
                  if (isPlus) {
                    openModal("COMPOSE_FORM_VIEW");
                    removeSchedule();
                  } else {
                    if (isDirty) {
                      e.preventDefault();
                      setNavigateAction(() => router.push(tab.path));
                      setSaveAsDraftModalOpen(true);
                    }
                    if (
                      tab.id === "notifications" &&
                      notificationGroups?.[0]?.most_recent_notification_id
                    ) {
                      handleNotificationRead(
                        notificationGroups[0]
                          .most_recent_notification_id as string
                      );
                    }
                  }
                }}
                className={cn(
                  "relative w-fit flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                  {
                    "text-[#fff]": isActive,
                    "text-gray-600 hover:text-gray-900": !isActive,
                    "px-2.5 py-2 bg-orange-900 rounded-lg text-[#fff]": isPlus,
                    "p-2": !isPlus,
                  }
                )}
                aria-label={tab.label}
              >
                <Icon
                  size={isPlus ? 32 : 24}
                  className={`text-[${isPlus ? "#fff" : "#96A6C2"}] ${
                    isActive ? "stroke-[2.5]" : "stroke-2"
                  }`}
                />
                <LinkStatus />
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full py-4 gap-4">
            <button
              onClick={() => router.push("/auth/sign-up")}
              className={cn(
                "w-full max-w-xs bg-orange-900 font-bold text-base text-white rounded-md py-2 cursor-pointer hover:opacity-90"
              )}
            >
              {t("login.create_account")}
            </button>
            <div className="flex justify-center items-center gap-2">
              <p>{t("login.have_account")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSignInWithMastodon?.(false);
                  router.push("/auth/sign-in");
                }}
                className={cn(
                  "hover:opacity-80 rounded-3xl shadow-xs focus-visible:shadow-none focus-visible:border-gray-500 focus-visible:ring-0"
                )}
              >
                {t("login.sign_in")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BottomTabNavigator;
