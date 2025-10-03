"use client";

import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ExploreCard from "@/components/organisms/search/ExploreCard";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";

import { useChannelFeedCollection } from "@/hooks/queries/useChannelFeedCollection";
import { useRouter } from "next/navigation";

import { useSearchChannelAndCommunity } from "@/hooks/queries/search/useSearchAllQueries";
import ChannelBySearch from "@/components/organisms/search/ChannelsTab";
import { useLocale } from "@/providers/localeProvider";
import HomeHeader from "@/components/molecules/HomeHeader";
import SearchInput from "@/components/molecules/common/Searchinput";

const ExploreSearchListPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { t } = useLocale();
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchKeyword(value);
  }, 500);

  const { data: searchChannelRes } = useSearchChannelAndCommunity({
    searchKeyword,
    enabled: searchKeyword.length > 0,
  });

  const { data: collectionList } = useCollectionChannelList();

  const { data: newsmastColletionlList } = useNewsmastCollections();

  const { data: channelFeedCollectionList } = useChannelFeedCollection({
    enabled: true,
  });

  return (
    <div className="w-full px-4">
      <HomeHeader exploreSearch={true} />
      <div className="w-full mx-auto mb-4">
        <SearchInput
          className="sticky mt-4"
          onSearch={debouncedSearch}
          placeholder={t("channel.explore_channels")}
        />
      </div>

      {searchChannelRes ? (
        <ChannelBySearch searchData={searchChannelRes} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <ExploreCard
            title={t("screen.channels")}
            count={channelFeedCollectionList?.[0]?.attributes.community_count || 0}
            image={[
              channelFeedCollectionList?.[1]?.attributes.avatar_image_url ?? "",
              channelFeedCollectionList?.[2]?.attributes.avatar_image_url ?? "",
              channelFeedCollectionList?.[3]?.attributes.avatar_image_url ?? "",
              channelFeedCollectionList?.[4]?.attributes.avatar_image_url ?? "",
            ]}
            type="channel"
            onClick={() => router.push("/channels")}
          />
          <ExploreCard
            title={t("screen.newsmast_channels")}
            count={newsmastColletionlList?.[0]?.attributes.community_count ?? 0}
            image={[
              newsmastColletionlList?.[1]?.attributes.avatar_image_url ?? "",
              newsmastColletionlList?.[2]?.attributes.avatar_image_url ?? "",
              newsmastColletionlList?.[3]?.attributes.avatar_image_url ?? "",
              newsmastColletionlList?.[4]?.attributes.avatar_image_url ?? "",
            ]}
            type="newsmast"
            onClick={() => router.push("/newsmast-channel/all-collection")}
          />
          <ExploreCard
            title={t("screen.communities")}
            count={collectionList?.[0]?.attributes.community_count ?? 0}
            image={[
              collectionList?.[1]?.attributes.avatar_image_url ?? "",
              collectionList?.[2]?.attributes.avatar_image_url ?? "",
              collectionList?.[3]?.attributes.avatar_image_url ?? "",
              collectionList?.[4]?.attributes.avatar_image_url ?? "",
            ]}
            type="collection"
            onClick={() =>
              router.push("/communities/communities?slug=all-collection")
            }
          />
        </div>
      )}
    </div>
  );
};

export default ExploreSearchListPage;
