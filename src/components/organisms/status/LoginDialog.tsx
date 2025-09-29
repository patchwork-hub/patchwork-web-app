"use client";
import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import {
  Bookmark,
  Heart,
  LogIn,
  MoreHorizontal,
  Repeat,
  Reply,
  XIcon,
} from "lucide-react";
import { useLocale } from "@/providers/localeProvider";
import { Button } from "@/components/atoms/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Status as StatusType } from "../../../types/status";
import useLoggedIn from "@/lib/auth/useLoggedIn";
import Cookies from "js-cookie";
import { useAuthStoreAction } from "@/stores/auth/authStore";

interface LoginDialogProps {
  status?: StatusType;
  action?: React.ReactNode;
  actionType: "reply" | "boost" | "favorite" | "bookmark" | "menu" | "login";
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  status,
  action,
  actionType,
  openDialog,
  setOpenDialog,
}) => {
  const { t } = useLocale();
  const { setSignInWithMastodon } = useAuthStoreAction();
  const router = useRouter();
  const isLoggedIn = useLoggedIn();

  const text = useMemo(() => {
    switch (actionType) {
      case "reply":
        return `reply`;
      case "boost":
        return "reblog";
      case "favorite":
        return "favorite";
      case "bookmark":
        return "bookmark";
      case "menu":
        return "menu";
      default:
        return "login";
    }
  }, [actionType]);

  const actions = useMemo(() => {
    switch (actionType) {
      case "reply":
        return {
          icon: <Reply className="text-red-700" />,
          text: "Reply to",
        };
      case "boost":
        return {
          icon: <Repeat className="text-red-700" />,
          text: "Boost",
        };
      case "favorite":
        return {
          icon: <Heart className="text-red-700" />,
          text: "Favorite",
        };
      case "bookmark":
        return {
          icon: <Bookmark className="text-red-700" />,
          text: "Bookmark",
        };
      case "menu":
        return {
          icon: <MoreHorizontal className="text-red-700" />,
          text: "Menu",
        };
      default:
        return {
          icon: <LogIn className="text-red-700" />,
          text: "Login",
        };
    }
  }, [actionType]);

  useEffect(() => {
    if (openDialog) {
      Cookies.set("slug", status?.account?.acct ?? "");
      Cookies.set("id", status?.id ?? "");
    }else{
      Cookies.remove("slug");
      Cookies.remove("id");
    }
  }, [openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      {!isLoggedIn && actionType === "login" ? (
        <>
          <DialogContent isCloseButton={false}>
            <DialogHeader className="relative">
              <DialogTitle className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center gap-4">
                  <p className="text-center">{`To continue, you need to login.`}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4">
              <div
                className="absolute right-4 top-4 z-10 cursor-pointer"
                onClick={() => setOpenDialog(false)}
              >
                <XIcon className="w-4 h-4" />
              </div>

              <div className="flex flex-col justify-center items-center gap-4">
                <button
                  onClick={() => router.push("/auth/sign-up")}
                  className={cn(
                    "w-full max-w-xs bg-orange-900 font-bold text-base text-white rounded-md py-2 cursor-pointer hover:opacity-90"
                  )}
                >
                  {t("login.create_account")}
                </button>
                <div className="flex items-center justify-center gap-2">
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
            </div>
          </DialogContent>
        </>
      ) : (
        <>
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            {action}
          </div>
          <DialogContent isCloseButton={false}>
            <DialogHeader className="relative">
              {actionType !== "menu" ? (
                <DialogTitle className="flex justify-center items-center gap-2">
                  {actions.icon}
                  <p>
                    {actions.text}{" "}
                    {status?.account?.display_name || status?.account?.username}
                  </p>
                </DialogTitle>
              ) : (
                <DialogTitle className="flex justify-center items-center gap-2">
                  <p className="text-center">{`To continue, you need to login.`}</p>
                </DialogTitle>
              )}
              <div
                className="absolute right-0 top-0 z-10 cursor-pointer"
                onClick={() => setOpenDialog(false)}
              >
                <XIcon className="w-4 h-4" />
              </div>
            </DialogHeader>
            <div className="p-4 space-y-4">
              {actionType !== "menu" && (
                <p className="text-center">{`To continue, you need to ${text} from your account.`}</p>
              )}
              <div className="flex flex-col justify-center items-center gap-4">
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
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default LoginDialog;
