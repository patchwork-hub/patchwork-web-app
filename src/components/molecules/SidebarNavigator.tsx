"use client";
import { cn } from "@/lib/utils";
import { Bell, Home, ListPlus, Mail, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SettingIcon } from "../atoms/icons/Icons";
import { useDraftStore } from "../organisms/compose/store/useDraftStore";
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
import { useModalAction } from "../organisms/modal/modal.context";
import { useScheduleStore } from "../organisms/compose/store/useScheduleStore";
import { useLocale } from "@/providers/localeProvider";
import { Button } from "../atoms/ui/button";
import LanguageSwitcher from "../organisms/locale/LanguageSwitcher";
import { LinkStatus } from "./common/LinkStatus";
import PatchworkLogo from "../atoms/icons/PatchworkLogo";
import { useSearchStore } from "@/stores/search/useSearchStore";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import { getToken } from "@/stores/auth";
import { useAuthStoreAction } from "@/stores/auth/authStore";
import { NotificationGroup } from "@/types/notification";

const NotificationIcon = ({
  pathname,
  lastReadId,
  notificationGroups = [],
  message,
}: {
  pathname: string;
  lastReadId?: string | object;
  notificationGroups?: NotificationGroup[];
  message?: { data?: { noti_type?: string; visibility?: string } } | null;
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
      <Bell className="w-5 h-5 group-hover:text-white" />
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

const SidebarNavigator = () => {
  const pathname = usePathname();
  const router = useRouter();
  const domain = Cookies.get("domain");
  const token = getToken();
  const { openModal } = useModalAction();
  const { removeSchedule } = useScheduleStore();
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
  const { setSearch } = useSearchStore();
  const { setSignInWithMastodon } = useAuthStoreAction();
  const { t } = useLocale();

  const lastReadId = notificationMarker?.notifications?.last_read_id || {};
  const notificationGroups =
    groupNotificationsData?.pages?.[0]?.data?.notification_groups;

  const tabs = [
    {
      id: "home",
      icon: <Home className="w-5 h-5 group-hover:text-white" />,
      label: `${t("navigation.home")}`,
      path: "/home",
    },
    {
      id: "search",
      icon: <Search className="w-5 h-5 group-hover:text-white" />,
      label: `${t("navigation.search")}`,
      path: "/search",
    },
    {
      id: "plus",
      icon: (
        <Plus
          className={cn("w-6 h-6 lg:w-5 lg:h-5 group-hover:text-white", {
            "text-white lg:text-orange-500": pathname !== "/create-status",
            "text-white": pathname === "/create-status",
          })}
        />
      ),
      label: `${t("navigation.new_post")}`,
      path: "/create-status",
    },
    {
      id: "list-plus",
      icon: <ListPlus className="w-5 h-5 group-hover:text-white" />,
      label: `${t("navigation.new_list")}`,
      path: "/create-list",
    },
    {
      id: "notifications",
      icon: (
        <NotificationIcon
          pathname={pathname}
          lastReadId={lastReadId}
          notificationGroups={notificationGroups}
          message={
            message as {
              data?: { noti_type?: string; visibility?: string };
            } | null
          }
        />
      ),
      label: `${t("navigation.notifications")}`,
      path: "/notifications",
    },
    {
      id: "mail",
      icon: (
        <div className="relative">
          <Mail className="w-5 h-5 group-hover:text-white" />
          {pathname !== "/notifications" &&
          message &&
          (message as { data?: { noti_type?: string; visibility?: string } })
            ?.data?.noti_type === "mention" &&
          (message as { data?: { noti_type?: string; visibility?: string } })
            ?.data?.visibility === "direct" ? (
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" />
          ) : null}
        </div>
      ),
      label: `${t("navigation.messages")}`,
      path: "/conversations",
    },
    {
      id: "settings",
      icon: <SettingIcon className="w-5 h-5 group-hover:text-white" />,
      label: `${t("navigation.settings")}`,
      path: "/settings",
    },
  ];

  return (
    <nav
      className="max-sm:hidden h-dvh lg:ps-5 overflow-y-auto sticky top-0 left-0 z-30"
      style={{
        boxShadow: "5px 0 5px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex flex-col h-full py-4 transition-all duration-300">
        {/* Navigation items */}
        {token ? (
          <>
            {/* Logo/Brand area */}
            <div className="px-4 mb-6">
              <Link
                onNavigate={(e) => {
                  if (isDirty) {
                    e.preventDefault();
                    setNavigateAction(() => router.push("/home"));
                    setSaveAsDraftModalOpen(true);
                  }
                }}
                onClick={() => setSearch("")}
                href="/home"
              >
                <div className="flex items-center gap-2">
                  <PatchworkLogo className="w-13 h-13" />
                  <span className="text-lg font-bold max-lg:hidden">
                    Patchwork
                  </span>
                </div>
              </Link>
            </div>
            <div className="space-y-2 px-2">
              {tabs.map((tab) => {
                const isActive = pathname === tab.path;

                const isPlus = tab.id === "plus";

                return (
                  <Link
                    key={tab.id}
                    onClick={() => setSearch("")}
                    href={!isPlus ? tab.path : ""}
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
                      "group flex gap-3 justify-center lg:justify-start items-center w-full p-3 rounded-lg transition-all duration-200 cursor-pointer relative",
                      {
                        "bg-orange-900 !text-white": isActive,
                        "hover:bg-orange-500/80 hover:text-white text-foreground":
                          !isActive,
                        "max-lg:bg-orange-900 max-lg:rounded-lg hover:text-white":
                          isPlus,
                      }
                    )}
                    aria-label={tab.label}
                  >
                    <span
                      className={cn("text-foreground", {
                        "!text-white": isActive,
                        "text-orange-500 hover:text-white": isPlus,
                      })}
                    >
                      {tab.icon}
                    </span>
                    <span
                      className={cn("hidden lg:inline", {
                        "font-bold": isPlus,
                      })}
                    >
                      {tab.label}
                    </span>
                    <LinkStatus />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="px-2 flex flex-col justify-start h-full space-y-8">
              <div className="max-w-[400px] mx-auto px-4">
                <div className="flex flex-col items-center gap-2 px-4 mb-2">
                  <div
                    className="rounded-full cursor-pointer"
                    onClick={() => router.push("/home")}
                  >
                    <PatchworkLogo className="w-20 h-20" />
                  </div>
                </div>
              </div>

              <div className="px-4 space-y-8">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => router.push("/auth/sign-up")}
                    className={cn(
                      "w-full max-w-xs bg-orange-900 font-bold text-base text-white rounded-md py-2 cursor-pointer hover:opacity-90"
                    )}
                  >
                    {t("login.create_account")}
                  </button>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p>{t("login.have_account")}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSignInWithMastodon?.(false);
                      router.push("/auth/sign-in");
                    }}
                    className={cn("hover:opacity-80 rounded-3xl shadow-xs")}
                  >
                    {t("login.sign_in")}
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  className={cn(
                    "w-full bg-background text-foreground border hover:bg-background h-10"
                  )}
                  onClick={() => {
                    setSignInWithMastodon?.(true);
                    router.push("/auth/sign-in");
                  }}
                >
                  {t("login.mastodon_login")}
                </Button>
              </div>
            </div>

            <div className="mx-4">
              <LanguageSwitcher label={false} />{" "}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SidebarNavigator;
