import { DEFAULT_API_URL } from "@/utils/constant";
import { Status } from "../../types/status";
import http from "@/lib/http";
import { getMaxId } from "@/utils";



export type StatusListResponse = {
  statuses: Status[];
  nextMaxId: string | null;
};


export type StatusFilterParams = {
  limit: number;
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  excludeReblogs?: boolean;
  pageParam?: string | null;
  excludeOriginalStatuses?: boolean;
}


export type AccountStatusParams = StatusFilterParams & {
  accountId: string;
  onlyReblogs?: boolean;
}


export type HomeTimelineParams = StatusFilterParams & {
  instanceUrl?: string;
  remote?: boolean;
  local?: boolean;
  excludeDirect?: boolean;
  isCommunity?: boolean;
}


export type HashtagTimelineParams = StatusFilterParams & {
  remote?: boolean;
  hashtag: string;
}


export type ListTimelineParams = StatusFilterParams & {
  remote?: boolean;
  id: string; 
}



export const fetchAccountStatuses = async ({
  accountId,
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
  onlyReblogs,
}: AccountStatusParams): Promise<StatusListResponse> => {
  const url = `/api/v1/accounts/${accountId}/statuses`;
  const searchParams = new URLSearchParams();

  
  searchParams.append("limit", limit.toString());

  if (excludeReplies) {
    searchParams.append("exclude_replies", "true");
  }

  if (onlyMedia) {
    searchParams.append("only_media", "true");
  }

  if (excludeReblogs) {
    searchParams.append("exclude_reblogs", "true");
  }

  if (excludeOriginalStatuses) {
    searchParams.append("exclude_original_statuses", "true");
  }

  
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  if (onlyReblogs) {
    searchParams.append("only_reblogs", "true");
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  
  return {
    statuses: excludeReplies
      ? response.data.filter((it) => !it.in_reply_to_id)
      : response.data,
    nextMaxId: getMaxId(response.headers["link"]),
  };
};

export const fetchHomeTimeline = async ({
  instanceUrl = DEFAULT_API_URL,
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
  remote,
  local,
  excludeDirect,
  isCommunity,
}: HomeTimelineParams): Promise<StatusListResponse> => {
  const url = new URL(
    `${instanceUrl}/api/v1/timelines/${isCommunity ? "public" : "home"}`
  );

  
  url.searchParams.append("limit", limit.toString());

  if (excludeReplies) {
    url.searchParams.append("exclude_replies", "true");
  }

  if (excludeDirect) {
    url.searchParams.append("exclude_direct", "true");
  }

  if (local) {
    url.searchParams.append("local", "true");
  }

  if (onlyMedia) {
    url.searchParams.append("only_media", "true");
  }

  if (excludeReblogs) {
    url.searchParams.append("exclude_reblogs", "true");
  }

  if (excludeOriginalStatuses) {
    url.searchParams.append("exclude_original_statuses", "true");
  }

  if (remote) {
    url.searchParams.append("remote", "true");
  }

  
  if (pageParam) {
    url.searchParams.append("max_id", pageParam);
  }

  
  const response = await http.get<Status[]>(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  
  return {
    statuses: response.data
      .filter((it) => !(excludeReplies && it.in_reply_to_id))
      .filter((it) => !(excludeDirect && it.visibility === "direct")),
    nextMaxId: getMaxId(response.headers["link"]),
  };
};

export const fetchHashtagTimeline = async ({
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
  remote,
  hashtag,
}: HashtagTimelineParams): Promise<StatusListResponse> => {
  const url = `/api/v1/timelines/tag/${hashtag}`;
  const searchParams = new URLSearchParams();

  
  searchParams.append("limit", limit.toString());

  if (excludeReplies) {
    searchParams.append("exclude_replies", "true");
  }

  if (onlyMedia) {
    searchParams.append("only_media", "true");
  }

  if (excludeReblogs) {
    searchParams.append("exclude_reblogs", "true");
  }

  if (excludeOriginalStatuses) {
    searchParams.append("exclude_original_statuses", "true");
  }

  if (remote) {
    searchParams.append("remote", "true");
  }

  
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  
  return {
    statuses: excludeReplies
      ? response.data.filter((it) => !it.in_reply_to_id)
      : response.data,
    nextMaxId: getMaxId(response.headers["link"]),
  };
};

export const fetchListTimeline = async ({
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
  remote,
  id,
}: ListTimelineParams): Promise<StatusListResponse> => {
  const url = `/api/v1/timelines/list/${id}`;
  const searchParams = new URLSearchParams();

  
  searchParams.append("limit", limit.toString());

  if (excludeReplies) {
    searchParams.append("exclude_replies", "true");
  }

  if (onlyMedia) {
    searchParams.append("only_media", "true");
  }

  if (excludeReblogs) {
    searchParams.append("exclude_reblogs", "true");
  }

  if (excludeOriginalStatuses) {
    searchParams.append("exclude_original_statuses", "true");
  }

  if (remote) {
    searchParams.append("remote", "true");
  }

  
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  
  return {
    statuses: excludeReplies
      ? response.data.filter((it) => !it.in_reply_to_id)
      : response.data,
    nextMaxId: getMaxId(response.headers["link"]),
  };
};

export const fetchNewsmastTimeline = async ({
  accountId,
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
}: AccountStatusParams): Promise<StatusListResponse> => {
  const url = new URL(
    `https://newsmast.community/api/v1/accounts/${accountId}/statuses`
  );

  
  url.searchParams.append("limit", limit.toString());

  if (excludeReplies) {
    url.searchParams.append("exclude_replies", "true");
  }

  if (onlyMedia) {
    url.searchParams.append("only_media", "true");
  }

  if (excludeReblogs) {
    url.searchParams.append("exclude_reblogs", "true");
  }

  if (excludeOriginalStatuses) {
    url.searchParams.append("exclude_original_statuses", "true");
  }

  
  if (pageParam) {
    url.searchParams.append("max_id", pageParam);
  }

  
  const response = await http.get<Status[]>(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  
  return {
    statuses: excludeReplies
      ? response.data.filter((it) => !it.in_reply_to_id)
      : response.data,
    nextMaxId: getMaxId(response.headers["link"]),
  };
};