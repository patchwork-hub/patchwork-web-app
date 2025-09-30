"use client";
import Header from "@/components/molecules/common/Header";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useFollowingAccountsQuery } from "@/hooks/queries/useFollowingAccount";
import { Account } from "@/types/patchwork";
import { flattenPages } from "@/utils/helper/timeline";
import React from "react";

type FollowingPage = {
  accountId: string;
  acct: string;
  isRemoteUser: boolean;
}
type FollowerResponse = {
  data: Account[];
  max_id: string | null;
}
const FollowingPage: React.FC<FollowingPage> = ({ accountId, acct, isRemoteUser }) => {
  const domain = acct.split("@")[1];
  const username = acct.split("@")[0];
  const externalLink = `https://${domain}/@${username}/following`;

  const { data, hasNextPage, fetchNextPage, isLoading } = useFollowingAccountsQuery({
    accountId,
    enabled: !!accountId,
  });

  const typedData = data as unknown as { pages: FollowerResponse[] } | undefined;
    
  const followingData = typedData?.pages?.flatMap((page) => page.data) ?? [];
  const followerIds = followingData.map((follower: Account) => follower.id);

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
        relationships={relationships ?? []}
        followerIds={followerIds}
        isOtherServer={isRemoteUser}
        externalLink={externalLink}
        lastItem={<div key="next-fetch-trigger" ref={ref} />}
      />
    </>
  );
};

export default FollowingPage;
