import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { CHANNEL_ORG_INSTANCE, DEFAULT_DASHBOARD_API_URL, userOriginInstanceDomain } from "@/utils/constant";

export const getChannelListForChannelSection = async () => {
  const params: Record<string, any> = { 
      domain_name: process.env.DASHBOARD_API_URL || DEFAULT_DASHBOARD_API_URL, 
      isDynamicDomain: true 
    };
    
    if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
      params.instance_domain = cleanDomain(userOriginInstanceDomain);
    }
  try {
    const resp: AxiosResponse<{ data: ChannelList[] }> =
      await axiosInstance.get("/api/v1/channels/channel_feeds",
      { params }
    );
    return resp.data.data;
  } catch (e) {
    return handleError(e);
  }
};
