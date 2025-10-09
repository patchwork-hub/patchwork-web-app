"use client";
import Header from "@/components/molecules/common/Header";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useFollowerAccountsQuery } from "@/hooks/queries/useFollowerAccount";
import { Account } from "@/types/patchwork";

import React from "react";

type FollowerPage = {
  accountId: string;
  acct: string;
  isRemoteUser: boolean;
}

type FollowerResponse = {
  data: Account[];
  max_id: string | null;
}

const FollowerPage: React.FC<FollowerPage> = ({ accountId, acct, isRemoteUser }) => {
  const domain = acct.split("@")[1];
  const username = acct.split("@")[0];
  const externalLink = `https://${domain}/@${username}/following`;
  const { data, hasNextPage, fetchNextPage, isLoading } = useFollowerAccountsQuery({
    accountId,
    enabled: !!accountId
  });

  const typedData = data as unknown as { pages: FollowerResponse[] } | undefined;
  
  const followerData = typedData?.pages?.flatMap((page) => page.data) ?? [];
  const followerIds = followerData.map((follower: Account) => follower.id);

  const { data: relationships } = useCheckRelationships({
    accountIds: followerIds
  });

  const ref = useInfiniteScroll(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      <Header title="Followers" />
      <SocialConnections
        isLoading={isLoading}
        data={followerData}
        relationships={relationships ?? []}
        followerIds={followerIds}
        isOtherServer={isRemoteUser}
        externalLink={externalLink}
        lastItem={<div key="next-fetch-trigger" ref={ref} />}
      />
    </>
  );
};

export default FollowerPage;
