"use client";

import Header from "@/components/molecules/common/Header";
import { useLocale } from "@/providers/localeProvider";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useGetSuggestedPeople } from "@/hooks/queries/search/useFetchSuggestion";
import { useSearchAllQueries } from "@/hooks/queries/search/useSearchAllQueries";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useSearchStore } from "@/stores/search/useSearchStore";
import { Account } from "@/types/patchwork";
import { useSearchParams } from "next/navigation";

const SuggestedPeopleListPage = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const { search } = useSearchStore();
  const { t } = useLocale();

  const { data, isLoading } = useGetSuggestedPeople({ limit: 20 });
  const { data: searchAllRes } = useSearchAllQueries({
    q: q ? q : search,
    resolve: true,
    limit: 11,
    options: { enabled: q ? q.length > 0 : search.length > 0 },
  });

  const accounts: Account[] = data?.map(
    (it: unknown) => (it as { account: Account }).account
  ) ?? [];

  const accountIds: string[] = accounts?.map(
    (account: Account) => account.id
  ) ?? [];

  const suggestedAccIds: string[] = searchAllRes?.accounts?.map(
    (it: unknown) => (it as Account).id
  ) ?? [];

  const { data: relationships } = useCheckRelationships({
    accountIds: (suggestedAccIds.length > 0 ? suggestedAccIds : accountIds),
    options: {
      enabled: accountIds.length > 0 || suggestedAccIds.length > 0,
    },
  });

  const headerTitle = q
    ? `Search results for "${q}"`
    : `${t("screen.people_to_follow")}`;

  const socialConnectionsData: Account[] = suggestedAccIds.length > 0 
    ? (searchAllRes?.accounts as Account[] ?? [])
    : accounts;

  return (
    <div className="mb-16">
      <Header title={headerTitle} />
      <SocialConnections
        isLoading={isLoading}
        data={socialConnectionsData}
        relationships={relationships ?? []}
        followerIds={accountIds}
      />
    </div>
  );
};

export default SuggestedPeopleListPage;