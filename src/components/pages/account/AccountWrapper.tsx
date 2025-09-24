import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import { useSearchQuery } from "@/hooks/queries/search/useSearchQuery";
import { useLookupAccount } from "@/hooks/queries/status/useLookupAccount";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import useLoggedIn from "@/lib/auth/useLoggedIn";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { JSX, use } from "react";

interface AccountWrapperProps {
  params: Promise<{ acct: string }>;
  render: (props: {
    accountId: string;
    isOwnProfile: boolean;
    acct: string;
    isRemoteUser: boolean;
    uri?: string;
    data?: any;
  }) => JSX.Element;
  isChannel?: boolean;
}

// AccountWrapper component must be used as a top-level component in a page
export const AccountWrapper = ({
  params,
  render,
  isChannel = false,
}: AccountWrapperProps) => {
  const { acct: acctParam } = use(params);
  const searchParams = useSearchParams();
  const uri = searchParams.get("q");
  const acct = decodeURIComponent(acctParam);
  const isLoggedIn = useLoggedIn();

  const currentDomain = Cookies.get("domain") ?? "mastodon.newsmast.org";

  const baseUsername = acct.startsWith("@") ? acct.slice(1) : acct;

  const username = isChannel ? baseUsername.toLowerCase() : baseUsername;

  const [user_name_without_domain, domain_name] = username.split("@");

  const isRemoteUser = domain_name ? domain_name !== currentDomain : false;

  const { data: searchResults, isLoading: isSearching } = useSearchQuery({
    query: isRemoteUser ? uri ?? username : "",
    type: "accounts",
    enabled: isRemoteUser,
  });

  const { data, isFetching } = useLookupAccount(
    isRemoteUser ? uri ?? username : user_name_without_domain
  );

  const { data: currentAccount } = useVerifyAuthToken({
    enabled: true,
  });

  const accountId = isRemoteUser
    ? searchResults?.accounts?.find((it) => username.includes(it.acct))?.id
    : data?.id;

  if (!isLoggedIn) {
    return render({
      accountId: data?.id,
      isOwnProfile: currentAccount?.acct === username,
      acct: username,
      uri,
      isRemoteUser: false,
      data,
    });
  }

  return isFetching || isSearching ? (
    <LoadingSpinner />
  ) : accountId ? (
    render({
      accountId,
      isOwnProfile: currentAccount?.acct === username,
      acct: username,
      uri,
      isRemoteUser,
      data,
    })
  ) : (
    <div className="min-h-10 flex items-center justify-center">
      <h1>Not found</h1>
    </div>
  );
};
