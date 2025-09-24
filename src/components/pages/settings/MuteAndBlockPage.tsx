"use client";
import Header from "@/components/atoms/common/Header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/ui/tabs";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import MuteAndBlockUserStats from "@/components/template/profile/MuteAndBlockUserStats";
import {
  useGetBlockedUserList,
  useGetMutedUserList,
} from "@/hooks/queries/settings/useMuteAndBlock";
import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import { isSystemDark } from "@/utils/helper/helper";
import { useTheme } from "next-themes";

const MuteAndBlockPage = () => {
  const {
    data: mutedUserPages,
    hasNextPage: hasNextMutedUsers,
    fetchNextPage: fetchNextMutedUsers,
  } = useGetMutedUserList();
  const {
    data: blockedUserPages,
    hasNextPage: hasNextBlockedUsers,
    fetchNextPage: fetchNextBlockedUsers,
  } = useGetBlockedUserList();
  const { theme } = useTheme();
  const mutedList = mutedUserPages?.pages?.flatMap((page) => page.data);
  const {t} = useLocale()
  const blockedList = blockedUserPages?.pages?.flatMap((page) => page.data);

  const hasValidMutedUser = mutedList?.some((item) => item !== undefined);
  const hasValidBlockedUser = blockedList?.some((item) => item !== undefined);

  const mutedUsersRef = useInfiniteScroll(() => {
    if (hasNextMutedUsers) {
      fetchNextMutedUsers();
    }
  });

  const blockedUsersRef = useInfiniteScroll(() => {
    if (hasNextBlockedUsers) {
      fetchNextBlockedUsers();
    }
  });

  return (
    <div>
      <Header title={t("screen.mute_and_block")} />
      <div className="p-4">
        <Tabs defaultValue="mute" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-2 bg-background text-foreground border-[0.5px] ${
             theme === "dark" || (theme === "system" && isSystemDark) ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <TabsTrigger value="mute" className="border-none relative">
             {t("timeline.mute")}
              {hasValidMutedUser ? (
                <span>({mutedList?.length})</span>
              ) : (
                <span>(0)</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="block" className="border-none relative">
              {t("timeline.block")}
              {hasValidBlockedUser ? (
                <span>({blockedList?.length})</span>
              ) : (
                <span>(0)</span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="mute">
            {hasValidMutedUser ? (
              <MuteAndBlockUserStats
                lastItem={
                  <div
                    key="muted-users-next-fetch-trigger"
                    ref={mutedUsersRef}
                  />
                }
                data={mutedList}
                type="MUTE"
              />
            ) : (
              <p className="text-center p-4">{t("timeline.mute_empty")}</p>
            )}
          </TabsContent>
          <TabsContent value="block">
            {hasValidBlockedUser ? (
              <MuteAndBlockUserStats
                lastItem={
                  <div
                    key="blocked-users-next-fetch-trigger"
                    ref={blockedUsersRef}
                  />
                }
                data={blockedList}
                type="BLOCK"
              />
            ) : (
              <p className="text-center p-4">{t("timeline.block_empty")}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MuteAndBlockPage;
