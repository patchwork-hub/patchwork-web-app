import axiosInstance from "@/lib/http";
import { HashtagDetailQueryKey } from "@/types/queries/hashtag.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const fetchHashtagDetail = async (
  qfContext: QueryFunctionContext<HashtagDetailQueryKey>
) => {
  const { hashtag, domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<HashtagDetail> = await axiosInstance.get(
    `/api/v1/tags/${hashtag}`,
    {
      params: { domain_name, isDynamicDomain: true },
    }
  );
  return resp.data;
};
