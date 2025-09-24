import http from "@/lib/http";
import { Account, AccountRelationship } from "@/types/status";

export const searchAccounts = async (query: string) => {
  const response = await http.get<Account[]>(
    `/api/v1/accounts/search?q=${query}&limit=10`
  );
  return response.data;
};

export const muteAccount = async ({
  id,
  notifications = false,
  duration = 0,
}: {
  id: string;
  notifications?: boolean;
  duration?: number;
}) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/mute`,
    null,
    {
      params: {
        notifications,
        duration,
      },
    }
  );
  return response.data;
};

export const unmuteAccount = async (id: string) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/unmute`
  );
  return response.data;
};

export const blockAccount = async (id: string) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/block`
  );
  return response.data;
};

export const unblockAccount = async (id: string) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/unblock`
  );
  return response.data;
};

export const followAccount = async (id: string) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/follow`
  );
  return response.data;
};

export const unfollowAccount = async (id: string) => {
  const response = await http.post<AccountRelationship>(
    `/api/v1/accounts/${id}/unfollow`
  );
  return response.data;
};

export const checkAccountRelationship = async (id: string) => {
  const response = await http.get<AccountRelationship[]>(
    `/api/v1/accounts/relationships?id[]=${id}&with_suspended=true`
  );
  return response.data;
};

export const lookupAccount = async (acct: string) => {
  const response = await http.get<Account>(
    `/api/v1/accounts/lookup?acct=${acct}`
  );
  return response.data;
};

export const newsmastDetail = async (acct: string, domain_name?: string) => {
  const response = await http.get<Account>(
    `/api/v1/accounts/lookup?acct=${acct}`,
    {
      params: {
        domain_name: domain_name ?? process.env.NEXT_PUBLIC_API_URL,
        isDynamicDomain: true,
      },
    }
  );
  return response.data;
};
