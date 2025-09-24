import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { GetNewsmastChannelListParams } from "../home-feed/newsmastChannelsService";

export const setPrimaryChannel = async (
  params?: GetNewsmastChannelListParams
) => {
  try {
    const cleanedDomain = params?.instance_domain
      ? cleanDomain(params.instance_domain)
      : "newsmast.social";
    const resp: AxiosResponse<{ data: ChannelList[] }> =
      await axiosInstance.post(
        "/api/v1/joined_communities/set_primary",
        {
          id: params.id,
          instance_domain: cleanedDomain,
          platform_type: "newsmast.social",
        },
        {
          params: {
            domain_name:
              process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
              DEFAULT_DASHBOARD_API_URL,
            isDynamicDomain: true,
          },
        }
      );
    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
