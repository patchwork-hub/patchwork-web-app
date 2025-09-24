"use client";

import { cn, truncateUsername } from "@/lib/utils";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FollowAvatarSkeleton from "../skeletons/followAvatarSkeleton";
import { useTheme } from "next-themes";
import { useLocale } from "../providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";
import { ThemeText } from "../common/ThemeText";
import ListIcon from "../common/ListIcon";

type TFollowing = {
  data?: Account[];
  loading?: boolean;
};

const PeopleFollowing = ({ data = [], loading = false }: TFollowing) => {
  const { theme } = useTheme();
  const {t} = useLocale()
  const router = useRouter();
  const modifiedData = Cookies.get("domain")
    ? [{ id: "icon" } as Account, ...data]
    : data;

  const limitedData = modifiedData.slice(0, 10);

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
        {t("screen.for_you")}
      </ThemeText> 
      <ThemeText
        size="md_16"
        className="cursor-pointer"
        onClick={() => router.push("/following")}
      >
        {t("common.view_all")}
      </ThemeText>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 ${index === 0 ? "ml-4" : ""} ${
            index === 2 ? "mr-4" : ""
          }`}
        >
          <FollowAvatarSkeleton />
        </div>
      ))}
    </div>
  );

  const renderFollowing = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {limitedData.map((account, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            index === 0 ? "ml-4!" : ""
          } ${index === limitedData.length - 1 ? "mr-4" : ""}`}
        >
          {account.id === "icon" ? (
            <ListIcon
              stroke="black"
              className="bg-[#96A6C2] w-32 sm:w-36 h-32 sm:h-36 object-cover rounded-full transition-all duration-300 ease-in-out"
            />
          ) : (
            <Image
              src={account.avatar}
              alt={`${account.username} image`}
              onClick={() => router.push(`/@${account.acct}`)}
              width={200}
              height={200}
              loading="lazy"
              className="w-32 sm:w-36 h-32 sm:h-36 object-cover rounded-full transition-all duration-300 ease-in-out"
            />
          )}
          <div
            onClick={() => {
              if (account.id === "icon") {
                router.push("/following");
              } else {
                router.push(`/@${account.acct}`);
              }
            }}
            className="absolute top-0 left-0 w-32 sm:w-36 h-32 sm:h-36 bg-gradient-to-b from-transparent to-black/70 rounded-full transition-all duration-300 ease-in-out"
          />
          <ThemeText size="xl_20" className="mt-1 text-sm">
            {account.id === "icon" ? (
              <ThemeText
                className={cn(theme === "dark" || (theme === "system" && isSystemDark) ? "text-white!" : "text-black!")}
                onClick={() => router.push(`/following`)}
              >
                Following
              </ThemeText>
            ) : (
              <span onClick={() => router.push(`/@${account.acct}`)} 
              className={cn(theme === "dark" || (theme === "system" && isSystemDark) ? "text-white!" : "text-black!")}
                >
                {truncateUsername(account.display_name || account.username)}
              </span>
            )}
          </ThemeText>
        </div>
      ))}
    </div>
  );

  if (!loading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <div className="mt-8">
      {renderHeader()}
      {loading ? renderLoadingState() : renderFollowing()}
    </div>
  );
};

export default PeopleFollowing;
