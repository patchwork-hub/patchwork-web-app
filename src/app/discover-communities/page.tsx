"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import { Button } from "@/components/atoms/ui/button";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { useGetNewsmastChannelList } from "@/hooks/queries/useNewsmastChannel.query";
import {  Circle, CircleCheck, User, UserPlus } from "lucide-react";
import Image from "next/image";
import { useSetPrimaryChannel } from "@/hooks/queries/useSetPrimary.query";
import {
  useFavouriteCommunityChannel,
  useUnFavouriteCommunityChannel,
} from "@/hooks/mutations/community/useToggleFavouriteChannel";
import { toast } from "sonner";
import { useSelectedDomain } from "@/stores/auth/activeDomain";
import { useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";

export default function DiscoverCommunitiesLayout() {
  const domain_name = useSelectedDomain();
  const { data: lists, isLoading: newsmastLoading } = useGetNewsmastChannelList(
    {
      instance_domain: domain_name,
    }
  );
  const { data: serverInfo, isFetching: isSearching } = useSearchServerInstance(
    {
      domain: domain_name,
    }
  );

  const { mutate: setPrimary } = useSetPrimaryChannel();
  const { mutate: favorite } = useFavouriteCommunityChannel();
  const { mutate: unfavorite } = useUnFavouriteCommunityChannel();

  const handleSetPrimary = (channelSlug: string) => {
    setPrimary(
      {
        id: channelSlug,
        instance_domain: domain_name,
      },
      {
        onSuccess: () => {
          console.log("Primary channel set successfully");
        },
        onError: (error) => {
          console.error("Failed to set primary channel:", error);
        },
      }
    );
  };

  const handleFavorite = (slug: string) => {
    favorite({
      id: slug,
      instance_domain: domain_name,
    });
  };

  const handleUnfavorite = (slug: string) => {
    if (lists && lists?.length >= 6) {
      unfavorite({
        id: slug,
        instance_domain: domain_name,
      });
    } else {
      toast.error("You must keep at least 5 favourite channels.");
    }
  };
  return (
    <section className="dvh">
      <Header title="My channels" />

      <Image
        src={serverInfo?.thumbnail?.url ?? FALLBACK_PREVIEW_IMAGE_URL}
        width={700}
        height={200}
        style={{
          aspectRatio: 3.35 / 1,
          objectFit: "cover",
        }}
        className="w-full"
        alt="banner image"
      />
      <div className="p-4 text-foreground">
        <h3 className="font-bold text-lg">Discover communities</h3>
        <p className="font-normal text-base">
          Tap the plus icon to add channels to my communities
        </p>
      </div>

      {/* List of communities */}
      {newsmastLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4 pb-20">
          {lists?.map((channel, index) => (
            <div
              key={channel.id}
              className={`px-4 py-3 flex justify-between items-center ${
                index !== lists.length - 1 ? "border-b border-foreground" : ""
              }`}
            >
              <div className="flex items-center gap-x-4 ">
                <Image
                  src={
                    channel.attributes.avatar_image_url ||
                    FALLBACK_PREVIEW_IMAGE_URL
                  }
                  width={100}
                  height={100}
                  style={{
                    aspectRatio: 1 / 1,
                    objectFit: "cover",
                  }}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                  alt={`${channel.attributes.name} profile image`}
                />
                <div>
                  <h4 className="font-bold">{channel.attributes.name}</h4>
                  <p className="font-normal">
                    {channel.attributes.favourited_count} followers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-x-4">
                {channel.attributes.is_primary ? (
                  <CircleCheck className="cursor-pointer" />
                ) : (
                  <Circle
                    className="cursor-pointer"
                    onClick={() => handleSetPrimary(channel.attributes.slug)}
                    data-testid={`set-primary-${channel.attributes.slug}`}
                  />
                )}
                {channel.attributes.favourited ? (
                  <Button
                    variant="outline"
                    className="rounded-full w-20 font-bold gap-1"
                    onClick={() => handleUnfavorite(channel.attributes.slug)}
                    data-testid={`remove-favorite-${channel.attributes.slug}`}
                  >
                    <User size={16} />
                    <span>Added</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-full w-20"
                    onClick={() => handleFavorite(channel.attributes.slug)}
                    data-testid={`add-favorite-${channel.attributes.slug}`}
                  >
                    <UserPlus size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
