import axiosInstance from "@/lib/http";
import { getMaxId } from "@/utils";
import { AxiosResponse } from "axios";

export const getFollowingAccounts = async ({
  accountId, max_id
}: {
  accountId: string;
  max_id?: string;
}) => {
  const resp: AxiosResponse<Account[]> = await axiosInstance.get(
    `/api/v1/accounts/${accountId}/following`,
    {
      params: {
        max_id,
      },
    }
  );

  return {
    data: resp.data,
    max_id: getMaxId(resp.headers["link"])
  };
};
