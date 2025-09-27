"use client";

import { Profile } from "@/components/organisms/profile/Profile";
import { AccountPostsRepliesList } from "@/components/organisms/status/AccountPostsRepliesList";
import { AccountWrapper } from "@/components/pages/account/AccountWrapper";

export default function AccountStatusPage({
  params
}: {
  params: Promise<{ acct: string }>;
}) {
  return (
    <AccountWrapper
      params={params}
      render={({ accountId, isOwnProfile }) => (
        <>
          <Profile userId={accountId} isOwnProfile={isOwnProfile} />
          <AccountPostsRepliesList className="pb-5 mb-16" id={accountId} />
        </>
      )}
    />
  );
}
