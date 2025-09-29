"use client";
import Header from "@/components/molecules/common/Header";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useFollowingAccountsQuery } from "@/hooks/queries/useFollowingAccount";
import { useInfiniteScroll } from "@/hooks/scroll/useInfiniteScroll";
import { flattenPages } from "@/utils/helper/timeline";
import React from "react";

interface FollowingPage {
  accountId: string;
  acct: string;
  isRemoteUser: boolean;
}

const FollowingPage: React.FC<FollowingPage> = ({ accountId, acct, isRemoteUser }) => {
  const domain = acct.split("@")[1];
  const username = acct.split("@")[0];
  const externalLink = `https://${domain}/@${username}/following`;

  const { data, hasNextPage, fetchNextPage, isLoading } = useFollowingAccountsQuery({
    accountId,
    enabled: !!accountId,
  });

  const followingData = data?.pages.flatMap((page) => page.data);
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
      <Header title="Following" />
      <SocialConnections
        isLoading={isLoading}
        data={followingData}
        relationships={relationships}
        followerIds={followerIds}
        isOtherServer={isRemoteUser}
        externalLink={externalLink}
        lastItem={<div key="next-fetch-trigger" ref={ref} />}
      />
    </>
  );
};

export default FollowingPage;
