import { HashtagsFollowingQueryKey } from "@/types/queries/hashtag.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import axiosInstance from "@/lib/http";
import { AxiosResponse } from "axios";
import { handleError } from "@/utils/helper/helper";
import { HashtagsFollowing } from "@/types/patchwork";

export const getHashtagsFollowing = async (
  qfContext: QueryFunctionContext<HashtagsFollowingQueryKey>
) => {
  const { limit, domain_name } = qfContext.queryKey[1];
  try {
    const resp: AxiosResponse<HashtagsFollowing[]> = await axiosInstance.get(
      "/api/v1/followed_tags",
      {
        params: { domain_name, isDynamicDomain: true, limit },
      }
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};
