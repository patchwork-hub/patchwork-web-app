"use client";

import Header from "@/components/molecules/common/Header";
import { useLocale } from "@/providers/localeProvider";
import SocialConnections from "@/components/templates/profile/SocialConnections";
import { useGetSuggestedPeople } from "@/hooks/queries/search/useFetchSuggestion";
import { useSearchAllQueries } from "@/hooks/queries/search/useSearchAllQueries";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useSearchStore } from "@/stores/search/useSearchStore";

import { useSearchParams } from "next/navigation";

const SuggestedPeopleListPage = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const { search } = useSearchStore();
  const {t} = useLocale();

  const { data, isLoading } = useGetSuggestedPeople({ limit: 20 });
  const { data: searchAllRes } = useSearchAllQueries({
    q: q ? q : search,
    resolve: true,
    limit: 11,
    options: { enabled: q ? q.length > 0 : search.length > 0 },
  });

  const accounts = data?.map((it) => it.account);
  const accountIds = accounts?.map((account) => account.id);
  const suggestedAccIds = searchAllRes?.accounts?.map((it) => it.id);

  const { data: relationships } = useCheckRelationships({
    accountIds: (suggestedAccIds ? suggestedAccIds : accountIds) ?? [],
    options: {
      enabled: accountIds && accountIds.length > 0,
    },
  });

  const headerTitle = q ? `Search results for "${q}"` : `${t("screen.people_to_follow")}`;

  return (
    <div className="mb-16">
      <Header title={headerTitle} />
      <SocialConnections
        isLoading={isLoading}
        data={(suggestedAccIds ? searchAllRes?.accounts : accounts) ?? []}
        relationships={relationships ?? []}
        followerIds={accountIds ?? []}
      />
    </div>
  );
};

export default SuggestedPeopleListPage;
