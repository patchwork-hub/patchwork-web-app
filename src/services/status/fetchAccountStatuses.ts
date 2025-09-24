import { DEFAULT_API_URL } from "@/utils/constant";
import { Status } from "../../types/status";
import http from "@/lib/http";
import { getMaxId } from "@/utils";

export type StatusListResponse = {
  statuses: Status[];
  nextMaxId: string | null;
};

export const fetchAccountStatuses = async ({
  accountId,
  limit,
  excludeReplies,
  onlyMedia,
  excludeReblogs,
  pageParam,
  excludeOriginalStatuses,
  onlyReblogs,
}): Promise<StatusListResponse> => {
  const url = `/api/v1/accounts/${accountId}/statuses`;
  const searchParams = new URLSearchParams();

  // Add pagination and filtering parameters
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

  // Add max_id parameter for pagination if we have a pageParam
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  if (onlyReblogs) {
    searchParams.append("only_reblogs", "true");
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  // Fetch the data
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Api does not work for excludeReplies, so added this filter here
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
}): Promise<StatusListResponse> => {
  const url = new URL(
    `${instanceUrl}/api/v1/timelines/${isCommunity ? "public" : "home"}`
  );

  // Add pagination and filtering parameters
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

  // Add max_id parameter for pagination if we have a pageParam
  if (pageParam) {
    url.searchParams.append("max_id", pageParam);
  }

  // Fetch the data
  const response = await http.get<Status[]>(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Api does not work for excludeReplies, so added this filter here
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
}): Promise<StatusListResponse> => {
  const url = `/api/v1/timelines/tag/${hashtag}`;
  const searchParams = new URLSearchParams();

  // Add pagination and filtering parameters
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

  // Add max_id parameter for pagination if we have a pageParam
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  // Fetch the data
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Api does not work for excludeReplies, so added this filter here
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
}): Promise<StatusListResponse> => {
  const url = `/api/v1/timelines/list/${id}`;
  const searchParams = new URLSearchParams();

  // Add pagination and filtering parameters
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

  // Add max_id parameter for pagination if we have a pageParam
  if (pageParam) {
    searchParams.append("max_id", pageParam);
  }

  const fullUrl = `${url}?${searchParams.toString()}`;

  // Fetch the data
  const response = await http.get<Status[]>(fullUrl, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Api does not work for excludeReplies, so added this filter here
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
}): Promise<StatusListResponse> => {
  const url = new URL(
    `https://newsmast.community/api/v1/accounts/${accountId}/statuses`
  );

  // Add pagination and filtering parameters
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

  // Add max_id parameter for pagination if we have a pageParam
  if (pageParam) {
    url.searchParams.append("max_id", pageParam);
  }

  // Fetch the data
  const response = await http.get<Status[]>(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Api does not work for excludeReplies, so added this filter here
  return {
    statuses: excludeReplies
      ? response.data.filter((it) => !it.in_reply_to_id)
      : response.data,
    nextMaxId: getMaxId(response.headers["link"]),
  };
};
