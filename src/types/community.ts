export type Guide = {
  title: string;
  position: number;
  description: string;
};

export type CommunityBio = {
  id: number;
  slug: string;
  name: string;
  bot_account: string;
  bot_account_id: string;
  bio: string;
  bot_account_info: string | null;
  guides: Guide[];
};

export type HashtagHistory = {
  day: string;
  accounts: string;
  uses: string;
};

export type HashtagData = {
  id: number;
  name: string;
  url: string;
  history: HashtagHistory[];
  post_count: number;
};

export type HashtagTimelineResponse = {
  data: HashtagData[];
  meta: {
    has_more_objects: boolean;
    offset: number;
  };
};

export type AccountField = {
  name: string;
  value: string;
  verified_at: string | null;
};

export type Account = {
  id: string;
  account_id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  hide_collections: boolean;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  primary_community_slug: string | null;
  primary_community_name: string | null;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string | null;
  collection_count: number | null;
  community_count: number | null;
  country: string;
  country_common_name: string;
  dob: string;
  subtitle: string;
  about_me: string;
  hash_tag_count: number;
  is_followed: boolean;
  is_requested: boolean;
  email: string | null;
  phone: string | null;
  step: string | null;
  is_active: boolean | null;
  is_account_setup_finished: boolean | null;
  domain: string;
  image_url: string;
  bio: string;
  is_popular: boolean;
  is_recommended: boolean;
  emojis: any[];
  fields: AccountField[];
  relationship_id: string;
  following: string;
  requested: string;
};

export type ContributorAttributes = {
  id: string;
  username: string;
  display_name: string;
  note: string;
  avatar_url: string;
  profile_url: string;
  following: string;
  is_muted: boolean;
  acct: string;
};

export type Contributor = {
  id: string;
  type: string;
  attributes: ContributorAttributes;
};

export type CommunityAccountResponse = {
  // contributors: Account[];
  // meta: {
  //   has_more_objects: boolean;
  // };
  contributors: Contributor[];
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
};


