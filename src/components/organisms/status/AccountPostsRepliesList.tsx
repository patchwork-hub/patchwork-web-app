import { useMemo, useState } from "react";
import { AccountStatusList } from "./AccountStatusList";
import { cn } from "@/lib/utils";
import { Tab, TabItem } from "@/components/molecules/common/Tab";
import Cookies from "js-cookie";
import { useLocale } from "@/components/molecules/providers/localeProvider";

type TabId = "Posts" | "Replies" | "Reposts" | "Posts & Replies";

export const AccountPostsRepliesList = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("Posts");
  const domain = Cookies.get("domain");
  const {t} = useLocale();

  const isDefaultUser = useMemo(() => {
    if (
      domain === "channel.org" ||
      domain === "newsmast.org" ||
      domain === "mo-me.social"
    ) {
      return true;
    }
    return false;
  }, []);

  const tabItems: TabItem<TabId>[] =
    isDefaultUser || !domain
      ? [
          { id: "Posts", label: `${t("common.posts")}` },
          { id: "Replies", label: `${t("common.replies")}` },
          { id: "Reposts", label: `${t("common.reposts")}` },
        ]
      : [
          { id: "Posts", label: `${t("common.posts")}` },
          { id: "Posts & Replies", label: `${t("common.posts_and_replies")}` },
        ];

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="sticky top-0 z-40">
        <Tab
          items={tabItems}
          defaultTab="Posts"
          onTabChange={handleTabChange}
        />
      </div>
      <div className={cn("mb-4", className)}>
        {isDefaultUser || !domain ? (
          <div className={activeTab === "Posts" ? "block" : "hidden"}>
            <AccountStatusList id={id} excludeReplies excludeReblogs />
          </div>
        ) : (
          <div className={activeTab === "Posts" ? "block" : "hidden"}>
            <AccountStatusList id={id} excludeReplies excludeOriginalStatuses />
          </div>
        )}

        <div className={activeTab === "Replies" ? "block" : "hidden"}>
          <AccountStatusList id={id} excludeReblogs excludeOriginalStatuses />
        </div>
        <div className={activeTab === "Reposts" ? "block" : "hidden"}>
          <AccountStatusList id={id} onlyReblogs />
        </div>
        <div className={activeTab === "Posts & Replies" ? "block" : "hidden"}>
          <AccountStatusList id={id} excludeReblogs />
        </div>
      </div>
    </>
  );
};
