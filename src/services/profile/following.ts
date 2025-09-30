import axiosInstance from "@/lib/http";
import { Account } from "@/types/patchwork";
import { getMaxId } from "@/utils";
import { AxiosResponse } from "axios";

type getFollowerAccountsParams = {
  accountId: string;
  max_id?: string;
}

export const getFollowerAccounts = async (
  params: getFollowerAccountsParams
) => {
  const { accountId, max_id } = params;

  const resp: AxiosResponse<Account[]> = await axiosInstance.get(
    `/api/v1/accounts/${accountId}/followers`,
    {
      params: {
        max_id
      }
    }
  );

  return {
    data: resp.data,
    max_id: getMaxId(resp.headers["link"])
  };
};
