export type HashtagsFollowingQueryKey = [
  "hashtags-following",
  { limit?: number; domain_name: string }
];
export type HashtagDetailQueryKey = [
  "hashtag-detail",
  { hashtag: string; domain_name: string }
];

export type TrendingHashtagQueryKey = ["trending-hashtags"];
