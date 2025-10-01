import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { CollectionList } from "@/types/patchwork";

export const getNewsmastCollections = async () => {
  try {
    const resp: AxiosResponse<{ data: CollectionList[] }> =
      await axiosInstance.get("/api/v1/collections/newsmast_collections", {
        params: {
          domain_name:
          DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
        },
      });
    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
