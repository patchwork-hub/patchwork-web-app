"use client";

import React, { use } from "react";
import Header from "@/components/molecules/common/Header";
import { HashtagTimeline } from "@/components/organisms/status/HashtagTimeline";
import { useActiveDomainStore } from "@/stores/auth/activeDomain";
import { calculateHashTagCount } from "@/utils/helper/helper";
import { useHashTagDetailQuery } from "@/hooks/queries/useHashtagDetail";
import { useToggleHashtagFollow } from "@/hooks/mutations/hashtag/useToggleHashtagFollow";
import { useLocale } from "@/providers/localeProvider";
import { HashtagHistory } from "@/types/patchwork";

type HashtagDetail = {
  id: string;
  name: string;
  url: string;
  history: HashtagHistory[];
  following: boolean;
}

export default function HashtagDetail({
  params
}: {
  params: Promise<{ hashtag: string }>;
}) {
  const { hashtag } = use(params);
  const {t} = useLocale();
  const { domain_name: activeDomain } = useActiveDomainStore();

  const { data: hashtagDetail, isLoading } = useHashTagDetailQuery({
    domain_name: activeDomain,
    hashtag
  });

  const { mutate: toggleFollow } = useToggleHashtagFollow({
    domain_name: activeDomain,
    hashtag
  });

  return (
    <>
      <Header title={`#${hashtag}`} />
      {isLoading || !hashtagDetail ? (
        <div className="flex items-center justify-between p-4">
          <div className="w-20 h-10 rounded-md bg-gray-600 animate-pulse [animation-delay:-0.3s]" />
          <div className="w-20 h-10 rounded-md bg-gray-600 animate-pulse [animation-delay:-0.3s]" />
        </div>
      ) : (
        <div className="cursor-pointer flex items-center justify-between p-4">
          <div>
            <p className="text-start">#{hashtagDetail.name}</p>
            <p className="opacity-60">{`${calculateHashTagCount(
              hashtagDetail.history,
              "uses"
            )} ${t("hashtag_detail.post_plural")} ${t("hashtag_detail.from")} ${calculateHashTagCount(
              hashtagDetail.history,
              "accounts"
            )} ${t("hashtag_detail.participant_plural")}`}</p>
          </div>
          <button
            className="border border-gray-600 rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => toggleFollow({ shouldFollow: !hashtagDetail.following })}
          >
            {hashtagDetail.following ? `${t("timeline.unfollow")}` : `${t("timeline.follow")}`}
          </button>
        </div>
      )}
      <div className="pb-4 mb-auto">
        <HashtagTimeline excludeReplies hashtag={hashtag} />
      </div>
    </>
  );
}
