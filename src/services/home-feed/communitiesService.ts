import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { handleError } from "@/utils/helper/helper";
import { QueryFunctionContext } from "@tanstack/react-query";
import { GetCollectionChannelListQueryKey } from "@/types/queries/channel.type";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";

export const getCollectionChannelList = async (
  qfContext: QueryFunctionContext<GetCollectionChannelListQueryKey>
) => {
  try {
    const resp: AxiosResponse<{ data: CollectionList[] }> =
      await axiosInstance.get("/api/v1/collections", {
        params: {
          domain_name:
            process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
        },
      });

    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
