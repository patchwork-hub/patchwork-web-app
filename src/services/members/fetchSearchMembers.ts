import axiosInstance from "@/lib/http";
import { Account } from "@/types/account";

export type SearchAccountsResponse = {
  accounts: Account[];
};

export const fetchSearchMember = async (
  query: string,
  type?: string
): Promise<SearchAccountsResponse> => {
  if (!query.trim()) {
    return { accounts: [] };
  }

  const response = await axiosInstance.get("/api/v2/search", {
    params: {
      q: query,
      type,
      resolve: true,
      limit: 100,
    },
  });

  return response.data;
};
