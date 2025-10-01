"use client";
import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/atoms/ui/avatar";
import { useSetPrimaryChannel } from "@/hooks/queries/useSetPrimary.query";
import { useGetNewsmastChannelList } from "@/hooks/queries/useNewsmastChannel.query";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { Circle, CircleCheck } from "lucide-react";
import { useSelectedDomain } from "@/stores/auth/activeDomain";

const ChoosePrimaryCommunity = () => {
  const domain_name = useSelectedDomain();

  const { data: lists } = useGetNewsmastChannelList({
    instance_domain: domain_name,
  });

  const { mutate: setPrimary } = useSetPrimaryChannel();

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

  return (
    <div>
      <p className="text-2xl font-bold text-foreground">
        Choose your primary community
      </p>
      <p className="text-foreground">
        Select your primary community to get started
      </p>

      {lists?.map((list, index) => (
        <div key={index} className="flex justify-between mt-4 w-full">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={
                  list.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL
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
          {list.attributes.is_primary ? (
            <CircleCheck className="cursor-pointer" />
          ) : (
            <Circle
              className="cursor-pointer"
              onClick={() => handleSetPrimary(list.attributes.slug)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChoosePrimaryCommunity;
