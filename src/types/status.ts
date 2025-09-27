import { Visibility } from "@/components/organisms/compose/types";

export type Media = {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  blurhash: string;
  description: string;
};

export type Status = {
  id: string;
  created_at: string;
  in_reply_to_id: null | string;
  in_reply_to_account_id: null | string;
  sensitive: boolean;
  spoiler_text: string;
  visibility: Visibility;
  language: string;
  uri: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  edited_at: null | string;
  favourited: boolean;
  reblogged: boolean;
  muted: boolean;
  bookmarked: boolean;
  pinned: boolean;
  content: string;
  filtered: unknown[];
  reblog: null | Status;
  application: Application;
  account: Account;
  media_attachments: Media[];
  mentions: Mention[];
  tags: Tag[];
  emojis: unknown[];
  card: Card;
  poll: Poll;
};

export type AccountRelationship = {
  id: string;
  following: boolean;
  showing_reblogs: boolean;
  notifying: boolean;
  followed_by: boolean;
  blocking: boolean;
  blocked_by: boolean;
  muting: boolean;
  muting_notifications: boolean;
  requested: boolean;
  domain_blocking: boolean;
  endorsed: boolean;
};

export type Account = {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  indexable: boolean;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  uri: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string;
  hide_collections: unknown;
  noindex: boolean;
  emojis: unknown[];
  roles: unknown[];
  fields: Field[];
};

export type Field = {
  name: string;
  value: string;
  verified_at: null | string;
};

export type Application = {
  name: string;
  website: string;
};

export type Card = {
  url: string;
  title: string;
  description: string;
  language: string;
  type: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  html: string;
  width: number;
  height: number;
  image: string;
  image_description: string;
  embed_url: string;
  blurhash: string;
  published_at: null | string;
  authors: unknown[];
};

export type Meta = {
  original: Original;
  small: Original;
};

export type Original = {
  width: number;
  height: number;
  size: string;
  aspect: number;
};

export type Mention = {
  id: string;
  username: string;
  url: string;
  acct: string;
};

export type Poll = {
  id: string;
  expires_at: string;
  expired: boolean;
  multiple: boolean;
  votes_count: number;
  voters_count: number | null;
  voted: boolean;
  own_votes: number[];
  options: Option[];
  emojis: unknown[];
};

export type Option = {
  title: string;
  votes_count: number;
};

export type Tag = {
  name: string;
  url: string;
};

export type Context = {
  ancestors: Status[];
  descendants: Status[];
};
