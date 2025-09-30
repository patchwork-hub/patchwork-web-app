// src/services/community/favouriteCommunityChannelService.ts
import { cleanDomain, handleError } from "@/utils/helper/helper";
import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";

type CommunityActionParams = {
  id: string;
  instance_domain?: string;
  platform_type?: string;
}

export const favouriteCommunityChannelMutationFn = async (
  params: CommunityActionParams
): Promise<{ message: string; favourited: boolean }> => {
  try {
    const cleanedDomain = params.instance_domain
      ? cleanDomain(params.instance_domain)
      : "newsmast.social";

    const resp: AxiosResponse<{ message: string }> = await axiosInstance.post(
      `/api/v1/joined_communities`,
      {
        id: params.id,
        instance_domain: cleanedDomain,
        platform_type: params.platform_type || "newsmast.social"
      },
      {
        params: {
          domain_name:
            process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
            DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true
        }
      }
    );

    return {
      message: resp.data.message,
      favourited: resp.data.message.includes("favorited")
    };
  } catch (error) {
    return handleError(error);
  }
};

export const unfavoriteCommunityBySlugMutationFn = async (
  params: CommunityActionParams
): Promise<{ message: string; favourited: boolean }> => {
  try {
    const cleanedDomain = params.instance_domain
      ? cleanDomain(params.instance_domain)
      : "newsmast.social";

    const resp: AxiosResponse<{ message: string }> = await axiosInstance.delete(
      `/api/v1/joined_communities/${params.id}`,
      {
        data: {
          id: params.id,
          instance_domain: cleanedDomain,
          platform_type: params.platform_type || "newsmast.social"
        },
        params: {
          domain_name:
            process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
            DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true
        }
      }
    );

    return {
      message: resp.data.message,
      favourited: resp.data.message.includes("favorited")
    };
  } catch (error) {
    return handleError(error);
  }
};
