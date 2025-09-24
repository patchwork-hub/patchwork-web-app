import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
export const toggleHashtagFollow = async ({
  hashtag,
  shouldFollow,
}: {
  hashtag: string;
  shouldFollow: boolean;
}) => {
  const endpoint = shouldFollow ? "follow" : "unfollow";

  try {
    const resp: AxiosResponse<HashtagDetail> = await axiosInstance.post(
      `/api/v1/tags/${hashtag}/${endpoint}`
    );

    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};
