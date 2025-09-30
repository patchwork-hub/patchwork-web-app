import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { ChannelList } from "@/types/patchwork";

export type GetNewsmastChannelListParams = {
  id?: string;
  instance_domain?: string;
}

export const getNewsmastChannelList = async (
  params?: GetNewsmastChannelListParams
) => {
  try {
    const cleanedDomain = params?.instance_domain
      ? cleanDomain(params.instance_domain)
      : "newsmast.social";
    const resp: AxiosResponse<{ data: ChannelList[] }> =
      await axiosInstance.get("/api/v1/channels/newsmast_channels", {
        params: {
          domain_name:
            process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
          instance_domain: cleanedDomain,
          plarform_type: "newsmast.social",
        },
      });

    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
