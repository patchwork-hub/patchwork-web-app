import { QueryFunctionContext } from "@tanstack/react-query";
import axiosInstance from "@/lib/http";
import { AxiosResponse } from "axios";
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { GetMyChannelQueryKey } from "@/types/queries/channel.type";
import { CHANNEL_ORG_INSTANCE, userOriginInstanceDomain } from "@/utils/constant";

export const getMyChannel = async (
  qfContext: QueryFunctionContext<GetMyChannelQueryKey>
) => {
  const { domain_name } = qfContext.queryKey[1];
  try {
    const params: Record<string, any> = { 
      domain_name, 
      isDynamicDomain: true 
    };
    
    if (userOriginInstanceDomain !== cleanDomain(CHANNEL_ORG_INSTANCE)) {
      params.instance_domain = cleanDomain(userOriginInstanceDomain);
    }

    const resp: AxiosResponse<MyChannel> = await axiosInstance.get(
      "/api/v1/channels/my_channel",
      { params }
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};
