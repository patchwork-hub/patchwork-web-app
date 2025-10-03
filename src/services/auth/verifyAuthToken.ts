import { handleError } from "@/utils/helper/helper";
import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/http";
import { GetNewsmastAccountlDetailQueryKey } from "@/types/queries/auth.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Account } from "@/types/patchwork";

export const verifyAuthToken = async () => {
  try {
    const resp: AxiosResponse<Account> = await axiosInstance.get(
      "/api/v1/accounts/verify_credentials"
    );
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getNewsmastUserInfo = async (
  qfContext: QueryFunctionContext<GetNewsmastAccountlDetailQueryKey>
) => {
  const { domain_name } = qfContext.queryKey[1];
  const resp: AxiosResponse<{ data: Account }> = await axiosInstance.get(
    "/api/v1/users/show_details",
    {
      params: {
        domain_name: domain_name,
        isDynamicDomain: true
      }
    }
  );
  return resp.data.data;
};
