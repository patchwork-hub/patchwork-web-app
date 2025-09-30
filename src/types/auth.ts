export type SearchServerInstanceQueryKey = [
  "search-server-instance",
  { domain: string }
];

export type LoginResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: string;
}

export type Instance_V2 = {
  domain: string;
  title: string;
  version: string;
  source_url: string;
  description: string;
  usage: Usage;
  thumbnail: Thumbnail;
  icon: Icon[];
  languages: string[];
  configuration: Configuration;
  registrations: Registrations;
  api_versions: ApiVersions;
  contact: Contact;
  rules: Rule[];
}

export type Usage = {
  users: Users;
}

export type Users = {
  active_month: number;
}

export type Thumbnail = {
  url: string;
  blurhash: string;
  versions: Versions;
}

export type Versions = {
  "@1x": string;
  "@2x": string;
}

export type Icon = {
  src: string;
  size: string;
}

export type Configuration = {
  urls: Urls;
  vapid: Vapid;
  accounts: Accounts;
  statuses: Statuses;
  media_attachments: MediaAttachments;
  polls: Polls;
  translation: Translation;
}

export type Urls = {
  streaming: string;
  status: string;
  about: string;
  privacy_policy: string;
  terms_of_service: unknown;
}

export type Vapid = {
  public_key: string;
}

export type Accounts = {
  max_featured_tags: number;
  max_pinned_statuses: number;
}

export type Statuses = {
  max_characters: number;
  max_media_attachments: number;
  characters_reserved_per_url: number;
}

export type MediaAttachments = {
  description_limit: number;
  image_matrix_limit: number;
  image_size_limit: number;
  supported_mime_types: string[];
  video_frame_rate_limit: number;
  video_matrix_limit: number;
  video_size_limit: number;
}

export type Polls = {
  max_options: number;
  max_characters_per_option: number;
  min_expiration: number;
  max_expiration: number;
}

export type Translation = {
  enabled: boolean;
}

export type Registrations = {
  enabled: boolean;
  approval_required: boolean;
  message: unknown;
  url: unknown;
}

export type ApiVersions = {
  mastodon: number;
}

export type Contact = {
  email: string;
  account: Account;
}

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
  hide_collections: boolean;
  noindex: boolean;
  emojis: unknown[];
  roles: unknown[];
  fields: Field[];
}

export type Field = {
  name: string;
  value: string;
  verified_at?: string;
}

export type Rule = {
  id: string;
  text: string;
  hint: string;
}

export type InstanceResponse = {
  vapid_key: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  client_secret_expires_at: string;
  id: string;
  name: string;
  website: string;
  scopes: Array<string>;
  redirect_uris: Array<string>;
}

export type InstanceAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: string;
}
