import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";

interface GetFavouriteChannelsParams {
  instance_domain?: string;
  platform_type?: string;
}

export const getFavouriteChannelLists = async (
  params?: GetFavouriteChannelsParams
) => {
  try {
    const cleanedDomain = params?.instance_domain
      ? cleanDomain(params.instance_domain)
      : undefined;

    const resp: AxiosResponse<{ data: ChannelList[] }> =
      await axiosInstance.get("/api/v1/channels/patchwork_demo_channels", {
        params: {
          domain_name:
            process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
            DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
          ...(cleanedDomain && { instance_domain: cleanedDomain }),
          ...(params?.platform_type && { platform_type: params.platform_type })
        }
      });
    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};

export const getJoinedCommunitiesList = async (
  params?: GetFavouriteChannelsParams
) => {
  try {
    const cleanedDomain = params?.instance_domain
      ? cleanDomain(params.instance_domain)
      : undefined;

    const resp: AxiosResponse<{
      data: JoinedCommunitiesList[];
      meta: { total: number };
    }> = await axiosInstance.get("/api/v1/joined_communities", {
      params: {
        domain_name:
          process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
          DEFAULT_DASHBOARD_API_URL,
        isDynamicDomain: true,
        ...(cleanedDomain && { instance_domain: cleanedDomain }),
        ...(params?.platform_type && { platform_type: params.platform_type })
      }
    });
    console.log("resp", resp.data);
    return resp.data;
  } catch (e) {
    return handleError(e);
  }
};
