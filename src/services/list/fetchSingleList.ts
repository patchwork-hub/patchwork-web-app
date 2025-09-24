import axiosInstance from "@/lib/http";

import { SingleListQueryKey } from "@/types/queries/lists.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const fetchSingleList = async (
  qfContext: QueryFunctionContext<SingleListQueryKey>
) => {
  const { id, domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<Lists> = await axiosInstance.get(
    `/api/v1/lists/${id}`,
    {
      params: { domain_name, isDynamicDomain: true },
    }
  );
  return resp.data;
};
