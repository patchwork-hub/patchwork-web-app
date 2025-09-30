import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import { Field } from "./auth";

export type Asset = {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  originalPath?: string;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
}

export type UpdateProfilePayload = {
  display_name?: string;
  note?: string;
  avatar?: File | string;
  header?: File | string;
  locked?: boolean;
  bot?: boolean;
  discoverable?: boolean;
  hide_collections?: boolean;
  indexable?: boolean;
  fields_attributes?: { name: string; value: string }[];
  source?: {
    privacy: string;
    sensitive: boolean;
    language: string;
  };
};

export type MuteBlockUserAccount = {
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
  hide_collections: boolean;
  noindex: boolean;
  mute_expires_at: string;
  emojis: MastodonCustomEmoji[];
  roles: Array<string>;
  fields: Field[];
  isUnMutedNow?: boolean;
  isUnBlockedNow?: boolean;
};

export type RelationShip = {
  blocked_by: boolean;
  blocking: boolean;
  domain_blocking: boolean;
  endorsed: boolean;
  followed_by: boolean;
  following: boolean;
  id: string;
  languages: null;
  muting: boolean;
  muting_notifications: boolean;
  note: string;
  notifying: boolean;
  requested: boolean;
  requested_by: boolean;
  showing_reblogs: boolean;
};
