"use client";
import React, { useCallback } from "react";
import { useCheckRelationships } from "@/hooks/queries/useCheckRelationship";
import { useMemo } from "react";
import { Button } from "@/components/atoms/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserRelationshipMutation } from "@/hooks/mutations/profile/useCheckRelationship";
import { CheckRelationshipQueryKey } from "@/types/queries/profile.type";
import { RelationShip } from "@/types/profile";
import { toast } from "sonner";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/localeProvider";
import { useGetSuggestedPeople } from "@/hooks/queries/search/useFetchSuggestion";
import { useSearchStore } from "@/stores/search/useSearchStore";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { queryClient } from "@/providers/queryProvider";
import { Account } from "@/types/patchwork";

type SuggestedPeopleBySearchProps = {
  data: Account[];
  hideViewAll?: boolean;
  checkNoResults: boolean;
}

const PeopleToFollowView: React.FC<SuggestedPeopleBySearchProps> = ({
  data,
  hideViewAll,
  checkNoResults,
}) => {
  const router = useRouter();
  const { search } = useSearchStore();
  const { t } = useLocale();
  const accountIds = useMemo(
    () => data?.map((people) => people.id) || [],
    [data]
  );

  const { data: currentAccount } = useVerifyAuthToken({
    enabled: true,
  });

  const { data: relationships } = useCheckRelationships({
    accountIds: accountIds,
    options: {
      enabled: accountIds.length > 0,
    },
  });

  const { isPending: suggestedPeoplePending } = useGetSuggestedPeople({
    limit: 10,
  });

  const { mutate, isPending } = useUserRelationshipMutation({
    onSuccess: (newRelationship, { accountId: acctId }) => {
      const relationshipQueryKey: CheckRelationshipQueryKey = [
        "check-relationship-to-other-accounts",
        { accountIds },
      ];

      queryClient.setQueryData<RelationShip[]>(relationshipQueryKey, (old) => {
        if (!old) return [newRelationship];
        return old.map((rel) =>
          rel.id === acctId ? { ...rel, ...newRelationship } : rel
        );
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onMakeRelationship = useCallback(
    (item: Account) => {
      if (!isPending) {
        mutate({
          accountId: item.id,
          isFollowing:
            relationships?.find((rel) => rel.id === item.id)?.following ||
            relationships?.find((rel) => rel.id === item.id)?.requested ||
            false,
        });
      }
    },
    [mutate, isPending, relationships]
  );

  if (suggestedPeoplePending) {
    return (
      <div className="mt-40">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            {Array.isArray(data) && data.length > 0 ? (
              <p className="my-3">{t("screen.people_to_follow")}</p>
            ): null}
            {!hideViewAll && data && data?.length > 5 && (
              <Link href={`/search/suggested-people?q=${search}`}>
                <Button
                  variant="link"
                  className="p-0 underline underline-offset-2 text-orange-500 cursor-pointer"
                >
                  {t("common.view_all")}
                </Button>
              </Link>
            )}
          </div>
          <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
            {data?.map((people, key) => (
              <div
                className={cn(
                  "flex flex-col items-center justify-between flex-shrink-0 mr-4 my-1 cursor-pointer",
                  {
                    "justify-start": currentAccount?.id === people.id,
                  }
                )}
                key={key}
              >
                <Image
                  src={people.avatar}
                  alt={people.username}
                  width={110}
                  height={110}
                  className="rounded-full w-[110px] h-[110px] bg-gray-600"
                  onClick={() =>
                    router.push(`/@${people.acct}?q=${people.uri}`)
                  }
                />
                <ThemeText
                  emojis={people.emojis}
                  className="mt-2 text-center max-w-[130px]"
                >
                  {people.display_name || people.username}
                </ThemeText>
                {currentAccount?.id !== people.id && (
                  <Button
                    size="sm"
                    onClick={() => onMakeRelationship(people)}
                    className="mt-2 rounded-3xl text-white"
                  >
                    <span className="text-sm">
                      {relationships?.find((rel) => rel.id === people.id)
                        ?.following
                        ? `${t("timeline.unfollow")}`
                        : `${t("timeline.follow")}`}
                    </span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        checkNoResults && (
          <div className="flex items-center justify-center flex-col gap-y-2 h-[calc(100vh-215px)]">
            <SearchX className="w-10 h-10" />
            <p className="text-gray-400 font-semibold">
              {t("common.no_results")}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PeopleToFollowView;
