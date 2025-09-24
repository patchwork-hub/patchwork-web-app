import axiosInstance from "@/lib/http";

import { AccountInListQueryKey } from "@/types/queries/lists.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const fetchAccountsInList = async (
  qfContext: QueryFunctionContext<AccountInListQueryKey>
) => {
  const { id, domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<Account[]> = await axiosInstance.get(
    `/api/v1/lists/${id}/accounts`,
    {
      params: { domain_name, isDynamicDomain: true },
    }
  );
  return resp.data;
};
