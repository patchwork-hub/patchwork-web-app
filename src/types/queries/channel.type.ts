import { Account } from "../account";

export type GetMyChannelQueryKey = [
  "my-channel",
  {
    domain_name: string;
  }
];
export type GetDetailCollectionChannelListQueryKey = [
  "detail-collection-channels",
  { slug: string; type?: "newsmast" | "channel" }
];

export type GetChannelAboutQueryKey = [
  "channel-about",
  { domain_name: string }
];

export type GetChannelAdditionalInfoQueryKey = [
  "channel-additional-info",
  { domain_name: string }
];

export type GetChannelDetailQueryKey = ["channel-detail", { id: string }];
export type GetCommunityDetailQueryKey = [
  "community-detail-profile",
  { id: string }
];

export type GetFavouriteChannelListsQueryKey = ["favourite-channel-lists"];
export type GetJoinedCommunitiesListQueryKey = ["joined-communities-list"];
export type GetCollectionChannelListQueryKey = ["collection-channels"];
export type GetNewsmastChannelListQueryKey = [
  "newsmast-channel-list",
  { instance_domain: string }
];
export type GetNewsmastCollectionListQueryKey = ["newsmast-collection-list"];
export type GetChannelFeedListQueryKey = ["channel-feed-list"];

export type FollowingAccountsQueryKey = [
  "following-accounts",
  {
    accountId: Account["id"];
    domain_name: string;
  }
];

export type FollowerAccountsQueryKey = [
  "follower-accounts",
  {
    accountId: Account["id"];
    domain_name: string;
  }
];

export type GetMyTotalChannelListQueryKey = ["my-total-channel"];

export type ContributorListQueryKey = [
  "contributor-list",
  { channelId: string }
];

export type ChannelHashtagListQueryKey = [
  "channel-hashtag-list",
  { channelId: string }
];

export type ChannelFilterKeywordListQueryKey = [
  "channel-filter-keyword-list",
  { channelId: string }
];

export type ChannelContentTypeQueryKey = [
  "channel-content-type",
  { channelId: string }
];

export type SearchContributorQueryKey = [
  "search-contributor",
  { keyword: string }
];

export type MutedContributorListQueryKey = [
  "muted-contributor-list",
  { channelId: string }
];

export type ChannelFilterOutKeywordListQueryKey = [
  "channel-filter-out-keyword-list",
  { channelId: string }
];

export type ChannelPostsTypeQueryKey = [
  "channel-posts-type",
  { channelId: string }
];
