"use client";
import Header from "@/components/atoms/common/Header";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useFollowerAccountsQuery } from "@/hooks/queries/useFollowerAccount";
import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import { flattenPages } from "@/utils/helper/timeline";

import React from "react";

interface FollowerPage {
  accountId: string;
  acct: string;
  isRemoteUser: boolean;
}

const FollowerPage: React.FC<FollowerPage> = ({ accountId, acct, isRemoteUser }) => {
  const domain = acct.split("@")[1];
  const username = acct.split("@")[0];
  const externalLink = `https://${domain}/@${username}/following`;
  const { data, hasNextPage, fetchNextPage, isLoading } = useFollowerAccountsQuery({
    accountId,
    enabled: !!accountId
  });

  const followerData = data?.pages?.flatMap((page) => page.data);
  const followerIds = flattenPages(data).map((follower) => follower.id);

  const { data: relationships } = useCheckRelationships({
    accountIds: followerIds
  });

  const ref = useInfiniteScroll(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  })

  return (
    <>
      <Header title="Followers" />
      <SocialConnections
        isLoading={isLoading}
        data={followerData}
        relationships={relationships}
        followerIds={followerIds}
        isOtherServer={isRemoteUser}
        externalLink={externalLink}
        lastItem={<div key="next-fetch-trigger" ref={ref} />}
      />
    </>
  );
};

export default FollowerPage;
