"use client";
import { ReportDialog } from "@/components/organisms/report/ReportDialog";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { getToken, removeToken } from "@/lib/auth";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import SidebarNavigator from "../molecules/SidebarNavigator";
import RightSidebar from "../molecules/RightSidebar";
import { useTheme } from "next-themes";
import { Locale } from "@/lib/locale/i18n";
import { cn } from "@/lib/utils";
import { isSystemDark } from "@/utils/helper/helper";
import { useUserPreferences } from "@/hooks/mutations/locale/useUserPreferences";
import useLoggedIn from "@/lib/auth/useLoggedIn";
import { useAuthStoreAction } from "@/stores/auth/authStore";
import { useReportDialogStore } from "@/stores/reportDialogStore";
import BottomTabNavigator from "../molecules/common/BottomTabNavigator";
import { useCustomEmojis } from "@/hooks/customs/useCustomEmojis";
import { useLocale } from "@/providers/localeProvider";

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setAuthToken, setUserInfo } = useAuthStoreAction();
  const token = getToken();
  const isLoggedIn = useLoggedIn();
  const { theme } = useTheme();
  const { setLocale } = useLocale();
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { data: authState, isLoading } = useVerifyAuthToken({
    enabled: !!token,
  });
  const { data: preferences, isLoading: isPreferencesLoading } =
    useUserPreferences(!!token);

  const queryClient = useQueryClient();

  const handleLogout = useCallback(async () => {
    setAuthToken("");
    localStorage.removeItem("fcmToken");
    removeToken();
    queryClient.clear();
    router.refresh();
  }, [setAuthToken, queryClient, router]);
  const { isOpen, account, status, closeDialog } = useReportDialogStore();

  useEffect(() => {
    if (!token || !domain) {
      setAuthToken("");
      return;
    }

    if (isLoading) {
      return;
    }

    if (authState) {
      setUserInfo(authState);
      setAuthToken(token);
    } else {
      handleLogout();
    }
  }, [
    token,
    domain,
    isLoading,
    authState,
    setAuthToken,
    handleLogout,
    setUserInfo,
  ]);

  useEffect(() => {
    if (preferences && !isPreferencesLoading) {
      setLocale(
        (preferences as unknown as Record<string, unknown>)?.[
          "posting:default:language"
        ] as Locale
      );
    }
  }, [preferences, isPreferencesLoading, setLocale]);

  useCustomEmojis();

  useEffect(() => {
    if (isLoggedIn) {
      Cookies.remove("slug");
      Cookies.remove("id");
    }
  }, [isLoggedIn]);

  return (
    <div className="flex justify-center min-h-dvh">
      <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_600px_minmax(0,1fr)] w-full max-w-screen-xl mx-auto">
        {/* Left Sidebar */}
        <SidebarNavigator />

        {/* Main Content */}
        <main
          id="main-content"
          style={{
            scrollbarGutter: "stable both-edges",
            scrollbarWidth: "thin",
          }}
          className={cn(
            "w-full flex flex-col border-x sm:mb-0 mb-[140px]",
            theme === "dark" || (theme === "system" && isSystemDark)
              ? "border-gray-600"
              : "border-gray-200"
          )}
        >
          {children}
          <BottomTabNavigator />
        </main>

        {/* Right Sidebar - Hidden on all screens except large */}
        <RightSidebar />

        {isOpen && (
          <ReportDialog
            isOpen={isOpen}
            onClose={closeDialog}
            account={account}
            status={status}
          />
        )}
      </div>
    </div>
  );
}
