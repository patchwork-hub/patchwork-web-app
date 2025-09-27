import http from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  GetCommunityAndChannelSearchQueryKey,
  SearchAllQueryKey
} from "./searchQuery";
import { ChannelAndCollectionSearch, HashtagDetail, SearchAll } from "@/types/patchwork";

export const trendingHashtagFn = async () => {
  try {
    const resp: AxiosResponse<HashtagDetail[]> = await http.get(
      `/api/v2/trends/tags`
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const searchAllFn = async ({
  queryKey
}: QueryFunctionContext<SearchAllQueryKey>) => {
  try {
    const [, params] = queryKey;
    const response: AxiosResponse<SearchAll> = await http.get(
      `/api/v2/search`,
      { params }
    );
    return response.data;
  } catch (e) {
    return handleError(e);
  }
};

export const searchChannelAndCommunity = async (
  qfContext: QueryFunctionContext<GetCommunityAndChannelSearchQueryKey>
) => {
  const { searchKeyword } = qfContext.queryKey[1];

  const resp: AxiosResponse<ChannelAndCollectionSearch> = await http.post(
    `/api/v1/search`,
    {
      q: searchKeyword
    },
    {
      params: {
        isDynamicDomain: true,
        domain_name: "https://dashboard.channel.org",
        removeBearerToken: true
      }
    }
  );
  return resp.data;
};
