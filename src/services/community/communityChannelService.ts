import axiosInstance from "@/lib/http";
import { ChannelList } from "@/types/patchwork";
import { GetDetailCollectionChannelListQueryKey } from "@/types/queries/channel.type";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const fetchCommunityChannel = async (
  qfContext: QueryFunctionContext<GetDetailCollectionChannelListQueryKey>
) => {
  const { slug, type } = qfContext.queryKey[1];
  const validTypes = ["newsmast", "channel"] as const;
  const requestType: "newsmast" | "channel" =
    type && validTypes.includes(type) ? type : "channel";
  try {
    const resp = await axiosInstance.get(
      `/api/v1/collections/fetch_channels?slug=${slug}&type=${requestType}`,
      {
        params: {
          domain_name:
            DEFAULT_DASHBOARD_API_URL,
            isDynamicDomain: true,
          slug,
        },
      }
    );
    if (requestType === "newsmast") {
      const typedResp = resp as AxiosResponse<ChannelList[] | unknown>;
      return typedResp.data;
    } else {
      const typedResp = resp as AxiosResponse<unknown>;
      return typedResp.data;
    }
  } catch (error) {
    console.error("Failed to fetch community channels:", error);
    throw error;
  }
};
