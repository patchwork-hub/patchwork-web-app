"use client";
import React, { useMemo, useState, useTransition } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/atoms/ui/avatar";
import { Button } from "@/components/atoms/ui/button";
import {
  useFavouriteCommunityChannel,
  useUnFavouriteCommunityChannel,
} from "@/hooks/mutations/community/useToggleFavouriteChannel";
import { useGetNewsmastChannelList } from "@/hooks/queries/useNewsmastChannel.query";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { User, UserPlus } from "lucide-react";
import { queryClient } from "@/providers/queryProvider";
import { useJoinedCommunitiesList } from "@/hooks/queries/useFavouriteChannelList.query";
import { DEFAULT_API_URL } from "@/utils/constant";
import ChoosePrimaryCommunity from "./ChoosePrimaryCommunity";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getToken } from "@/lib/auth";
import { useTheme } from "next-themes";
import { isSystemDark } from "@/utils/helper/helper";
import { useAuthStore } from "@/stores/auth/authStore";

const JoinCommunities: React.FC = () => {
  const domain_name = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { userOriginInstance } = useAuthStore();
  const token = getToken();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();

  const [step, setStep] = useState<number>(1);

  const { data: lists } = useGetNewsmastChannelList({
    instance_domain: domain_name,
  });

  const { data: joinedCommunitiesList } = useJoinedCommunitiesList({
    instance_domain: userOriginInstance,
    platform_type: "newsmast.social",
    enabled: token ? true : false,
  });

  const { mutate: favorite, isPending: isFavoritePending } =
    useFavouriteCommunityChannel();
  const { mutate: unfavorite, isPending: isUnfavoritePending } =
    useUnFavouriteCommunityChannel();

  const handleFavorite = (slug: string) => {
    favorite(
      {
        id: slug,
        instance_domain: domain_name,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["joined-communities-list"],
          });
        },
      }
    );
  };

  const handleUnfavorite = (slug: string) => {
    unfavorite(
      {
        id: slug,
        instance_domain: domain_name,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["joined-communities-list"],
          });
        },
      }
    );
  };

  const isTotalChannelAtLeastFive = useMemo(() => {
    return (
      (joinedCommunitiesList?.data?.reduce(
        (total, item) => total + (item.attributes.favourited ? 1 : 0),
        0
      ) ?? 0) >= 5
    );
  }, [joinedCommunitiesList]);

  console.log(lists);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between gap-6 p-6 md:py-20 md:w-[400px] md:mx-auto">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "w-1/2 h-1 rounded-sm",
              step === 1 ? "bg-orange-900" : "bg-gray-400"
            )}
          />
          <div
            className={cn(
              "w-1/2 h-1 rounded-sm",
              step === 2 ? "bg-orange-900" : "bg-gray-400"
            )}
          />
        </div>
        {step === 1 && (
          <div>
            <p className="text-2xl font-bold text-foreground">
              Join communities
            </p>
            <p className="text-foreground">Select at least 5</p>

            {lists?.map((list, index) => (
              <div key={index} className="flex justify-between mt-4 w-full">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        list.attributes.avatar_image_url ||
                        FALLBACK_PREVIEW_IMAGE_URL
                      }
                      alt={`${list.attributes.name} profile image`}
                    />
                    <AvatarFallback>
                      {list.attributes.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg">{list.attributes.name}</p>
                    <p className="text-sm text-foreground">
                      {list.attributes.favourited_count} followers
                    </p>
                  </div>
                </div>
                {list.attributes.favourited ? (
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-full w-20 font-bold gap-1",
                     theme === "dark" || (theme === "system" && isSystemDark)
                        ? "hover:text-gray-300"
                        : "hover:opacity-80"
                    )}
                    onClick={() => handleUnfavorite(list.attributes.slug)}
                  >
                    <User size={16} />
                    <span>Added</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-full w-20"
                    onClick={() => handleFavorite(list.attributes.slug)}
                  >
                    <UserPlus size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 2 && <ChoosePrimaryCommunity />}
      </div>

      {step === 1 ? (
        <Button
          className="w-full"
          disabled={
            !isTotalChannelAtLeastFive ||
            isFavoritePending ||
            isUnfavoritePending
          }
          loading={isFavoritePending || isUnfavoritePending}
          onClick={() => setStep(2)}
        >
          Continue
        </Button>
      ) : (
        <Button
          className="w-full"
          disabled={
            !isTotalChannelAtLeastFive ||
            isFavoritePending ||
            isUnfavoritePending
          }
          loading={isFavoritePending || isUnfavoritePending || isPending}
          onClick={() =>
            startTransition(() => {
              Cookies.remove("signup_step");
              router.push("/");
            })
          }
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default JoinCommunities;
