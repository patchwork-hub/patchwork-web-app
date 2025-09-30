
import { Button } from "@/components/atoms/ui/button";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { useLocale } from "@/providers/localeProvider";
import InfoSection from "@/components/organisms/profile/InfoSection";
import { useUserRelationshipMutation } from "@/hooks/mutations/profile/useCheckRelationship";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { RelationShip } from "@/types/profile";
import { CheckRelationshipQueryKey } from "@/types/queries/profile.type";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { UserRoundX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { Account } from "@/types/patchwork";

type SocialConnectionsProps = {
  data: Account[];
  relationships: RelationShip[];
  followerIds: string[];
  isOtherServer?: boolean;
  externalLink?: string;
  lastItem?: React.JSX.Element;
  isLoading?: boolean;
}

const SocialConnections: React.FC<SocialConnectionsProps> = ({
  data,
  relationships,
  followerIds,
  isOtherServer = false,
  externalLink,
  isLoading,
  lastItem,
}) => {
  const queryClient = useQueryClient();
  const searchParam = useSearchParams();
  const {t} = useLocale();

  const queryKey: CheckRelationshipQueryKey = [
    "check-relationship-to-other-accounts",
    { accountIds: followerIds },
  ];

  const { data: currentAccount } = useVerifyAuthToken({
    enabled: true,
  });

  const { mutate } = useUserRelationshipMutation({
    onMutate: async ({ accountId, isFollowing }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousRelationships =
        queryClient.getQueryData<RelationShip[]>(queryKey);

      queryClient.setQueryData<RelationShip[]>(queryKey, (old = []) =>
        old.map((rel) =>
          rel.id === accountId ? { ...rel, following: !rel.following } : rel
        )
      );

      return { previousRelationships };
    },
    onSuccess: async (data, { accountId }) => {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<RelationShip[]>(queryKey, (old = []) =>
        old.map((rel) => (rel.id === accountId ? data : rel))
      );

      queryClient.invalidateQueries({
        queryKey: ["suggested-people"],
      });
    },
    onError: (_, __, context) => {
      const typedContext = context as { previousRelationships?: RelationShip[] };
      queryClient.setQueryData(queryKey, typedContext?.previousRelationships);
    },
  });

  const relationshipsMap = useMemo(() => {
    return new Map(
      relationships?.reduce<[string, RelationShip][]>(
        (acc, rel) => acc.concat([[rel.id, rel]]),
        []
      ) ?? []
    );
  }, [relationships]);

  const getRelationshipStatus = (id: string) => {
    const relationship = relationshipsMap.get(id);
    if (relationship?.requested)
      return relationship?.requested ? `${t("timeline.requested")}` : `${t("timeline.follow")}`;
    return relationship?.following ? `${t("timeline.following")}` : `${t("timeline.follow")}`;
  };

  const onMakeRelationship = (
    accountId: Account["id"],
    relationship: RelationShip["following"]
  ) => {
    mutate({ accountId, isFollowing: relationship });
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="p-4 flex flex-col gap-4 h-full">
      {data && data.length > 0 && (
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          {data
            ?.map(
              (each, key) =>
                (!searchParam.get("q") ||
                  getRelationshipStatus(each?.id) !== "Following") && (
                  <div key={key} className="flex justify-between items-start">
                    <Link
                      href={`/@${each?.acct}?q=${each?.uri}`}
                      className="block"
                    >
                      <div className="flex gap-x-2 justify-start items-start">
                        <Image
                          src={each?.avatar}
                          alt={each?.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <InfoSection
                          emojis={each?.emojis}
                          accountName={each?.display_name || each?.username}
                          username={each?.acct}
                          joinedDate={dayjs(each?.created_at).format(
                            "MMM YYYY"
                          )}
                        />
                      </div>
                    </Link>
                    <div>
                      {currentAccount?.id !== each?.id && (
                        <Button
                          className="rounded-full px-3 w-auto h-7"
                          disabled={currentAccount?.id === each?.id}
                          onClick={() =>
                            onMakeRelationship(
                              each?.id,
                              getRelationshipStatus(each?.id) === "Following" ||
                                getRelationshipStatus(each?.id) === "Requested"
                            )
                          }
                        >
                          {getRelationshipStatus(each?.id)}
                        </Button>
                      )}
                    </div>
                  </div>
                )
            )
            .concat(lastItem ? [lastItem] : [])}
        </div>
      )}
      {data && data.length === 0 && (
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <UserRoundX className="w-10 h-10" />
            <p>No accounts found</p>
          </div>
        </div>
      )}
      {isOtherServer && (
        <div className="mt-auto flex flex-col justify-center items-center gap-1">
          <p className="text-sm text-gray-400">
            Follow from other servers are not displayed.
          </p>
          <p className="text-sm text-gray-400">
            See more follows on{" "}
            <a
              href={externalLink}
              className="text-orange-500 underline underline-offset-2"
              target="_blank"
            >
              mastodon.social
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialConnections;
