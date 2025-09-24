"use client";
import { ReportDialog } from "@/components/organisms/report/ReportDialog";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { getToken, removeToken } from "@/lib/auth";
import { useAuthStoreAction } from "@/store/auth/authStore";
import { useReportDialogStore } from "@/store/reportDialogStore";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BottomTabNavigator from "../atoms/common/BottomTabNavigator";
import SidebarNavigator from "../molecules/sidebar-navigator";
import RightSidebar from "../molecules/RightSidebar";
import { useCustomEmojis } from "../organisms/compose/hooks/useCustomEmojis";
import { useTheme } from "next-themes";
import { useLocale } from "../molecules/providers/localeProvider";
import { cn } from "@/lib/utils";
import { isSystemDark } from "@/utils/helper/helper";
import { useUserPreferences } from "@/hooks/mutations/locale/useUserPreferences";
import { set } from "lodash";
import useLoggedIn from "@/lib/auth/useLoggedIn";

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

  const handleLogout = async () => {
    setAuthToken(null);
    localStorage.removeItem("fcmToken");
    removeToken();
    queryClient.clear();
    router.refresh();
  };
  const { isOpen, account, status, closeDialog } = useReportDialogStore();

  useEffect(() => {
    if (!token || !domain) {
      setAuthToken(null);
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
  }, [token, domain, isLoading, authState, setAuthToken]);

  useEffect(() => {
    if (preferences && !isPreferencesLoading) {
      setLocale(preferences?.["posting:default:language"]);
    }
  }, [preferences]);

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
