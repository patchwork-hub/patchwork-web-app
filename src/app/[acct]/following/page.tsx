"use client";

import { AccountWrapper } from "@/components/pages/account/AccountWrapper";
import FollowingPage from "@/components/pages/profile/FollowingPage";
import { NextPage } from "next";

type FollowerProps = {
  params: Promise<{ acct: string }>;
}

const Follower: NextPage<FollowerProps> = ({ params }) => {

  return (
    <AccountWrapper
      params={params}
      render={({ accountId, acct, isRemoteUser }) => (
        <FollowingPage
          isRemoteUser={isRemoteUser}
          accountId={accountId}
          acct={acct} />
      )}
    />
  );
};
export default Follower;
