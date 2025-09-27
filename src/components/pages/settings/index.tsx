"use client";
import Header from "@/components/atoms/common/Header";
import { ThemeSwitcher } from "@/components/atoms/common/ThemeSwitcher";
import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/ui/dialog";
import { useLocale } from "@/providers/localeProvider";
import { queryClient } from "@/providers/queryProvider";
import { ReceiveEmailNotification } from "@/components/notifications/ReceiveEmailNotification";
import { ReceivePushNotification } from "@/components/notifications/ReceivePushNotification";
import { Schedules } from "@/components/organisms/compose/tools/Schedules";
import LanguageSwitcher from "@/components/organisms/locale/LanguageSwitcher";
import { useDeleteAccount } from "@/hooks/mutations/auth/useDeleteAccount";
import { useRevokeFCMToken } from "@/hooks/mutations/fcm/useRevokeFCMToken";
import { removeToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useSelectedDomain } from "@/store/auth/activeDomain";
import { useAuthStore } from "@/store/auth/authStore";
import { CHANNEL_ORG_INSTANCE, DEFAULT_API_URL } from "@/utils/constant";
import { cleanDomain, isSystemDark } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { ChevronRight, LogOut, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const SettingPage = () => {
  const {
    actions: { clearAuthState },
  } = useAuthStore();
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: revokeFCMToken } = useRevokeFCMToken();
  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setOpenLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    startTransition(async () => {
      try {
        const fcmToken = localStorage.getItem("fcmToken");
        await revokeFCMToken(fcmToken);
      } catch (e) {
        console.error("Error revoking FCM token:", e);
      } finally {
        clearAuthState();
        localStorage.removeItem("fcmToken");
        removeToken();
        queryClient.clear();
        // router.refresh();
        // router.push("/auth/sign-in");
        window.location.reload();
        // setTheme("system");
      }
    });
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(null, {
      onSuccess({ message }, variables, context) {
        toast.success(message);
      },
    });
    removeToken();
    queryClient.clear();
    router.push("/auth/sign-in");
  };

  const itemShown =
    domain === cleanDomain(CHANNEL_ORG_INSTANCE) || domain === DEFAULT_API_URL;
  const { t } = useLocale();
  return (
    <div className="h-dvh">
      <Header title={t("screen.profile_setting")} />
      <div className="p-8 flex flex-col justify-between h-[calc(100%-64px-70px)]">
        <div className="flex justify-start items-start gap-x-4">
          <UserRound />
          <div className="w-full space-y-4">
            <p className="text-xl font-semibold">
              {t("setting.account_settings")}
            </p>
            <ul className="space-y-3">
              {itemShown && (
                <Link className="block" href="/settings/info">
                  <li className="flex justify-between items-center">
                    {t("screen.my_information")}
                    <ChevronRight />
                  </li>
                </Link>
              )}
              {/* uncomment this after api done */}
              {/* {itemShown && (
                <Link className="block" href="/settings/change-password">
                  <li className="flex justify-between items-center">
                    Change password
                    <ChevronRight />
                  </li>
                </Link>
              )} */}
              <Link className="block" href="/settings/mute-and-block">
                <li className="flex justify-between items-center">
                  {t("setting.mute_and_block")}
                  <ChevronRight />
                </li>
              </Link>
              <Link className="block" href="/settings/bookmarks">
                <li className="flex justify-between items-center">
                  {t("screen.bookmarks")}
                  <ChevronRight />
                </li>
              </Link>
              <Link className="block" href="/lists">
                <li className="flex justify-between items-center">
                  {t("screen.lists")}
                  <ChevronRight />
                </li>
              </Link>
              <Schedules />
              <ThemeSwitcher />
              <LanguageSwitcher />
              {itemShown && <ReceivePushNotification />}
              {itemShown && <ReceiveEmailNotification />}
              <Link
                className="block"
                href={`${domain}/settings/profile`}
                target="_blank"
              >
                <li className="flex justify-between items-center">
                  {t("setting.advanced_settings")}
                  <ChevronRight />
                </li>
              </Link>

              {/* uncomment this after api done */}
              {/* {itemShown && (
                <Dialog
                  open={openDeleteDialog}
                  onOpenChange={setOpenDeleteDialog}
                >
                  <DialogTrigger asChild>
                    <button className="block w-full">
                      <li className="flex justify-between items-center">
                        Delete account
                        <ChevronRight />
                      </li>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-none">
                    <DialogHeader>
                      <DialogTitle>Delete account</DialogTitle>
                      <DialogDescription className="text-white">
                        Your account and all associated personal data will be
                        permanently deleted from our records. This action cannot
                        be undone. Please confirm if you wish to proceed.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="bg-orange-500 hover:bg-red-600 text-[#fff]"
                        loading={isDeleting}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )} */}
            </ul>
          </div>
        </div>
        <div>
          {/* Add Terms & Conditions, Privacy Policy, and Community Guidelines links */}
          <div className="my-5">
            <p className="text-orange-500 text-center text-xs sm:text-sm">
              <a
                href="https://www.newsmastfoundation.org/terms-conditions/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("setting.terms_and_conditions")}
              </a>
              ,{" "}
              <a
                href="https://mo-me.social/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("setting.privacy_policy")}
              </a>
              ,{" "}
              <a
                href="https://www.newsmastfoundation.org/community-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("setting.community_guidelines")}
              </a>
            </p>
          </div>
          <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={handleLogout}
                variant="outline"
                className={cn(
                  "w-full border border-gray-400",
                  theme === "dark" ||
                    (theme === "system" && isSystemDark && "text-white!")
                )}
                loading={isPending}
              >
                <LogOut />
                {t("setting.log_out")}
              </Button>
            </DialogTrigger>
            <DialogContent className="border-none">
              <DialogHeader>
                <DialogTitle>{t("setting.log_out")}</DialogTitle>
                <DialogDescription
                  className={cn(
                    theme === "dark" || (theme === "system" && isSystemDark)
                      ? "text-white"
                      : "text-black"
                  )}
                >
                  {t("setting.logout_confirmation")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenLogoutDialog(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmLogout}
                  loading={isPending}
                  className="lg:w-1/6 bg-orange-500 hover:bg-orange-500/90"
                >
                  {t("common.ok")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
