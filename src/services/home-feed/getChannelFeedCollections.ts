import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { CollectionList } from "@/types/patchwork";

export const getChannelFeedCollections = async () => {
  try {
    const resp: AxiosResponse<{ data: CollectionList[] }> =
      await axiosInstance.get("/api/v1/collections/channel_feed_collections", {
        params: {
          domain_name:
            process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true
        }
      });
    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
