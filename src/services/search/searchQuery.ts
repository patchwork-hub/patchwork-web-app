import http from "@/lib/http";
import { Hashtag } from "@/types/hashtag";
import { Account, Status } from "@/types/status";

export type SearchQueryParams = {
  query: string;
  type: "accounts" | "statuses" | "hashtags";
  domain_name?: string;
};

export type SearchQueryResponse = {
  accounts: Account[];
  statuses: Status[];
  hashtags: Hashtag[];
};

export const searchQuery = async ({ query, type, domain_name }: SearchQueryParams) => {
  const response = await http.get<SearchQueryResponse>(
    `/api/v2/search?q=${query}&type=${type}&limit=10&resolve=true`
  );
  return response.data;
};

export type SearchAllQueryParam = {
  q: string;
  resolve?: boolean;
  limit?: number;
  type?: "accounts" | "hashtags";
  offset?: number;
};

export type SearchAllQueryKey = ["search-all", SearchAllQueryParam];

export type GetCommunityAndChannelSearchQueryKey = [
  "channel-community-search",
  { searchKeyword: string }
];
