"use client";

import { AccountWrapper } from "@/components/pages/account/AccountWrapper";
import FollowerPage from "@/components/pages/profile/FollowerPage";
import { NextPage } from "next";

interface FollowerProps {
  params: Promise<{ acct: string }>;
}

const Follower: NextPage<FollowerProps> = ({ params }) => {
  return (
    <AccountWrapper
      params={params}
      render={({ accountId, acct, isRemoteUser }) => (
        <FollowerPage
          isRemoteUser={isRemoteUser}
          acct={acct}
          accountId={accountId}
        />
      )}
    />
  );
};

export default Follower;
