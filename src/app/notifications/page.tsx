'use client';

import { Tab, TabItem } from "@/components/molecules/common/Tab";
import { useEffect, useState } from "react";
import { checkSupportsNotiV2 } from "@/utils";
import Cookies from "js-cookie";
import { DEFAULT_API_URL } from "@/utils/constant";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { useLocale } from "@/providers/localeProvider";
import { useFCMStore } from "@/stores/conversations/useFCMStore";
import FollowRequestsNotifications from "@/components/molecules/notifications/FollowRequestsNotifications";
import GroupedNotificationsV2 from "@/components/molecules/notifications/GroupedNotificationsV2";
import GroupedNotificationsV1 from "@/components/molecules/notifications/GroupedNotificationsV1";
import MentionsNotifications from "@/components/molecules/notifications/MentionsNotifications";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";

type TabId = "All" | "Mentions" | "FollowRequests";

const NotificationsPage = () => {

  const queryClient = useQueryClient();
  const {t} = useLocale();

  const { data: currentUser } = useVerifyAuthToken({
    enabled: true,
  });
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { data: serverInfo, isLoading } = useSearchServerInstance({
    domain,
    enabled: true,
  });

  const isSupportNotiV2 = checkSupportsNotiV2(serverInfo?.version || '');
  const useV2 = domain === DEFAULT_API_URL ? true : isSupportNotiV2;

  const [activeTab, setActiveTab] = useState<TabId>('All');

  const tabItems: TabItem<TabId>[] = [
    { id: 'All', label: `${t('notifications.tabs.all')}` },
    { id: 'Mentions', label: `${t('notifications.tabs.mentions')}` },
    { id: 'FollowRequests', label: `${t('notifications.tabs.follow_requests')}` },
  ];

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const { message, setMessage } = useFCMStore();

  useEffect(() => {
    if (message) {
      if (activeTab === 'All') {
        queryClient.invalidateQueries({
          queryKey: ['notifications']
        });
      } else if (activeTab === 'Mentions') {
        queryClient.invalidateQueries({
          queryKey: ['mention-notifications']
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['follow-requests-notifications']
        });
      }
    }
  }, [message, activeTab, queryClient]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage('');
      }, 0);
    }
  }, [message, setMessage]);

  return (
    <div className="pb-16 sm:pb-4">
      <div className="sticky top-0 z-20">
        <Tab items={tabItems} defaultTab="All" onTabChange={handleTabChange} />
      </div>
      <div className="px-4">
        {activeTab === 'All' && !isLoading && (
          useV2 ? (
            <GroupedNotificationsV2 uri={currentUser?.uri ?? ""} />
          ) : (
            <GroupedNotificationsV1 />
          )
        )}
        {activeTab === 'Mentions' && (
          <MentionsNotifications />
        )}
        {activeTab === 'FollowRequests' && (
          <FollowRequestsNotifications />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;