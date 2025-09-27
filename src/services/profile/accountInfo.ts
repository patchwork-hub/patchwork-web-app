import http from "@/lib/http";
import { Account } from "@/types/account";

export const accountInfo = async (id: string): Promise<Account> => {
  const resp = await http.get<Account>(
    `/api/v1/accounts/${id}`,
  );
  return resp.data;
};
