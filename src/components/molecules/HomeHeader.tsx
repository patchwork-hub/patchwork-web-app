"use client";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTipTapEditor } from "@/components/organisms/compose/hooks/useTipTapEditor";
import useLoggedIn from "@/lib/auth/useLoggedIn";
import { useLocale } from "@/providers/localeProvider";
import GoBack from "./common/GoBack";
import PatchworkLogo from "../atoms/icons/patchwork-logo";
import { ThemeText } from "./common/ThemeText";
import { SettingIcon } from "../atoms/icons/Icons";
import { LinkStatus } from "./common/LinkStatus";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";

type THomeheader = {
  search?: boolean;
  exploreSearch?: boolean;
};

const HomeHeader = ({ search = false, exploreSearch = false }: THomeheader) => {
  const isLoggedIn = useLoggedIn();
  const { data: currentAccount, isLoading } = useVerifyAuthToken({
    enabled: true,
  });
  const { t } = useLocale();
  const { editorjsx } = useTipTapEditor({
    editable: false,
    className: "text-foreground font-normal text-base",
    content: currentAccount?.display_name || currentAccount?.username,
    emojis: currentAccount?.emojis,
  });

  return (
    <>
      <div
        className={cn(
          "w-full p-4 flex flex-row justify-between items-center sticky top-0 z-40 bg-background",
          exploreSearch && "p-0 py-6 px-1"
        )}
      >
        {exploreSearch ? (
          <div className="flex justify-start items-center gap-4">
            <GoBack
              className="opacity-80 active:opacity-80 text-foreground hover:opacity-90"
              backRoute={"/home"}
            />
            <p className={cn("text-foreground font-bold lg:text-2xl text-lg")}>
              {t("channel.explore_channels")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Link
                onNavigate={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                  }
                }}
                href={`/@${currentAccount?.acct}`}
              >
                {isLoggedIn ? (
                  <Image
                    src={currentAccount?.avatar || FALLBACK_PREVIEW_IMAGE_URL}
                    alt="Profile Picture"
                    priority
                    width={100}
                    height={100}
                    className="w-16 h-16  object-cover rounded-full transition-all duration-300 ease-in-out aspect-square"
                  />
                ) : (
                  <PatchworkLogo className="w-10 h-10" />
                )}
              </Link>
              {search ? (
                <div className="flex flex-col">
                  <ThemeText
                    size="xl_20"
                    variant="textBold"
                    className="text-start justify-start"
                  >
                    {t("screen.search")}
                  </ThemeText>
                </div>
              ) : (
                <Link href={`/@${currentAccount?.acct}`}>
                  <div className="flex flex-col">
                    <h3 className="text-foreground text-2xl font-bold">
                      {t("timeline.welcome_back")}
                    </h3>
                    {currentAccount ? (
                      <div className="text-foreground">{editorjsx}</div>
                    ) : (
                      <div className="h-4 rounded"></div>
                    )}
                  </div>
                </Link>
              )}
            </div>

            {!search && (
              <Link
                href="/settings"
                className="relative p-3 border border-slate-200 rounded-full active:opacity-80 cursor-pointer"
                aria-label="Settings"
              >
                <SettingIcon />
                <LinkStatus roundedFull />
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomeHeader;
