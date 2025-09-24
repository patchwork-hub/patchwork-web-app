// lib/api/channelMutations.ts
import axiosInstance from "@/lib/http";
import { DEFAULT_DASHBOARD_API_URL } from "@/utils/constant";
import { handleError } from "@/utils/helper/helper";
import { AxiosResponse } from "axios";

export const favouriteChannelMutationFn = async ({ id }: { id: string }) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await axiosInstance.post(
      `/api/v1/joined_communities`,
      { id }, // Request body with only the id
      {
        params: {
          domain_name:
            process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
            DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
        },
      } // Config params for interceptor
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteFavouriteChannelMutationFn = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await axiosInstance.delete(
      `/api/v1/joined_communities/${id}`,
      {
        params: {
          domain_name:
            process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
            DEFAULT_DASHBOARD_API_URL,
          isDynamicDomain: true,
        },
      }
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};
