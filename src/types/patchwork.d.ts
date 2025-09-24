// declare namespace Patchwork {
type MyChannel = {
  channel: {
    data: ChannelList;
  };
  channel_feed: {
    data: ProfileList;
  };
};

type ChannelList = {
  id: string;
  type: string;
  type?: "channel";
  attributes: ChannelAttributes;
};

type JoinedCommunitiesList = {
  id: string;
  type: string;
  attributes: ChannelAttributes;
  relationships: any;
};

type CollectionList = {
  id: string;
  type: string;
  attributes: CollectionAttributes;
};
type HashtagDetail = {
  id: string;
  name: string;
  url: string;
  history: any[];
  following: boolean;
};
type ChannelAdditionalInfo = {
  content: string;
  updated_at: string;
};

type ChannelAbout = {
  configuration: any;
  contact: {
    account: {
      acct: string;
      avatar: string;
      avatar_static: string;
      bot: boolean;
      created_at: string;
      discoverable: null;
      display_name: string;
      emojis: [];
      fields: [];
      followers_count: number;
      following_count: number;
      group: boolean;
      header: string;
      header_static: string;
      hide_collections: null;
      id: string;
      indexable: boolean;
      last_status_at: string;
      locked: boolean;
      noindex: boolean;
      note: string;
      statuses_count: number;
      uri: string;
      url: string;
      username: string;
    };
    email: string;
  };
  description: string;
  domain: string;
  languages: string;
  rules: ChannelAboutHint[];
  thumbnail: {
    blurhash: string;
    url: string;
  };
  title: string;
};

type CollectionAttributes = {
  id: number;
  name: string;
  slug: string;
  sorting_index: number;
  community_count: number;
  banner_image_url: string;
  avatar_image_url: string;
  channels: {
    data: ChannelList[];
  };
};

type ChannelAttributes = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_recommended: boolean;
  admin_following_count: number;
  account_id: number;
  patchwork_collection_id: number;
  guides: string;
  participants_count: number;
  visibility: string;
  created_at: string;
  favourited_count: boolean;
  community_type: {
    data: {
      id: string;
      type: string;
      attributes: {
        id: number;
        name: string;
      };
    };
  };
  banner_image_url: string;
  avatar_image_url: string;
  domain_name: string;
  follower: 0;
  about: string | null;
  favourited: boolean;
  community_admin: {
    account_id: string;
    id: string;
    username: string;
  };
  is_primary: boolean;
  patchwork_community_hashtags?: communityHashtags[];
};
type communityHashtags = {
  id: number;
  patchwork_community_id: number;
  hashtag: string;
  name: string;
};

type ProfileList = {
  id: string;
  type: "account";
  attributes: ProfileAttributes;
};

type ProfileAttributes = {
  id: string;
  name: string;
  username: string;
  email: string;
  display_name: string;
  confirmed_at: string;
  suspended_at: string | undefined;
  domain_name: string;
  avatar_image_url: string;
};

type Emoji = {
  shortcode: string;
  url: string;
  preview_url: string;
  static_url: string;
  visible_in_picker: boolean;
  category?: string;
};

type TabNavigator = {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
};

type Account = {
  id: string;
  account_id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  domain: string | null;
  bot: boolean;
  discoverable: boolean;
  hide_collections: boolean;
  group: boolean;
  created_at: string;
  note: string;
  uri: string;
  url: string;
  avatar: string;
  image_url: string;
  avatar_static: string;
  header: string;
  header_static: string;
  primary_community_slug: string;
  primary_community_name: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string;
  collection_count: number;
  community_count: number;
  country: string;
  country_common_name: string;
  dob: string;
  is_followed: boolean;
  is_requested: boolean;
  subtitle: string;
  contributor_role: string;
  voices: string;
  media: string;
  hash_tag_count: number;
  noindex: boolean;
  emojis: [];
  fields: Field[];
  tags: AccountBioHashTags[];
  email: string;
  phone: string;
  about_me: string;
  source?: {
    privacy: string;
    sensitive: string;
    language: null;
    note: string;
    fields: [];
    follow_requests_count: number;
    hide_collections?: string;
    discoverable?: boolean;
    indexable: boolean;
    email?: string;
    phone?: string;
  };
};
type Lists = {
  id: string;
  title: string;
  replies_policy: string;
  exclusive: boolean;
};
type HashtagHistory = {
  day: string;
  accounts: string;
  uses: string;
};
type HashtagsFollowing = {
  history: HashtagHistory[];
  name: string;
  url: string;
  following: boolean;
};
type Status = {
  id: string;
  communities: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  community_ids?: string[]; // Scheduled Status
  community_id: number;
  community_name: stirng;
  community_slug: string;
  created_at: string;
  in_reply_to_id?: string;
  in_reply_to_account_id?: string;
  sensitive: boolean;
  spoiler_text?: string;
  visibility: string;
  language: string;
  uri: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  translated_text: string;
  edited_at?: null;
  image_url: string;
  favourited: boolean;
  meta_title: string;
  bookmarked: boolean;
  reblogged: boolean;
  muted: boolean;
  pinned: boolean;
  content: string;
  filtered: any;
  reblog?: Status;
  application: {
    name: string;
    website?: null;
  };
  account: Account;
  media_attachments: Attachment[];
  mentions: Mention[];
  tags: Tags[];
  emojis: any;
  card?: Card;
  poll: Poll;
  is_rss_content: boolean;
  rss_link: string | null;
  is_meta_preview: boolean;
  text?: string;
  text_count: number;
  scheduled_at?: string;
  drafted?: boolean;
};

type Instance_V1 = {
  uri: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    blurhash?: string;
    versions?: { "@1x"?: string; "@2x"?: string };
  };
  short_description: string;
  email: string;
  version: string;
  languages: string[];
  registrations: boolean;
  approval_required: boolean;
  invites_enabled: boolean;
  urls: {
    streaming_api: string;
  };
  stats: {
    user_count: number;
    status_count: number;
    domain_count: number;
  };
  thumbnail?: string;
  contact_account?: Account;
  configuration?: {
    statuses: {
      max_characters: number;
      max_media_attachments: number;
      characters_reserved_per_url: number;
    };
    media_attachments: {
      supported_mime_types: string[];
      image_size_limit: number;
      image_matrix_limit: number;
      video_size_limit: number;
      video_frame_rate_limit: number;
      video_matrix_limit: number;
    };
    poll: {
      max_options: number;
      max_characters_per_option: number;
      min_expiration: number;
      max_expiration: number;
    };
  };
  account_domain?: string;
};

type InstanceResponse = {
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
};

type InstanceAuthroizationResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: string;
};
// }

type ContributorList = {
  id: string;
  type: string;
  attributes: Contributor;
};

type Contributor = {
  id: string;
  username: string;
  display_name: string;
  domain: string;
  note: string;
  avatar_url: string;
  profile_url: string;
  following: ContributorFollowStatus;
  is_muted: boolean;
  is_own_account: boolean;
};

type ContributorFollowStatus = "not_followed" | "following" | "requested";

type ChannelHashtag = {
  id: number;
  patchwork_community_id: number;
  hashtag: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type ChannelFilterKeyword = {
  id: number;
  patchwork_community_id: number;
  keyword: string;
  is_filter_hashtag: boolean;
  created_at: string;
  updated_at: string;
  filter_type: string;
};

type ChannelContentTpye = {
  id: string;
  type: string;
  attributes: ChannelContentAttribute;
};

type ChannelContentAttribute = {
  id: number;
  channel_type: string;
  custom_condition: "or_condition" | "and_condition";
  patchwork_community_id: number;
  created_at: string;
  updated_at: string;
};

type SearchContributorRes = {
  accounts: Contributor[];
};

type ChannelPostType = {
  posts: boolean;
  reposts: boolean;
  replies: boolean;
};

type SearchAll = {
  accounts: Account[];
  hashtags: HashtagDetail[];
  statuses: Status[];
};

type ChannelAndCollectionSearch = {
  communities: {
    data: ChannelList[];
  };
  collections: {
    data: CollectionList[];
  };
  channel_feeds: {
    data: ChannelList[];
  };
  newsmast_channels: {
    data: ChannelList[];
  };
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: string;
};
