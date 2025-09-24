import axiosInstance from "@/lib/http";
import {
  Instance_V2,
  InstanceAuthResponse,
  InstanceResponse
} from "@/types/auth";
import { DEFAULT_REDIRECT_URI } from "@/utils/constant";
import axios, { AxiosResponse } from "axios";

export const searchServerInstance = async (domain: string) => {
  try {
    const resp: AxiosResponse<Instance_V2> = await axiosInstance.get(
      "/api/v2/instance",
      {
        params: {
          domain_name: domain,
          isDynamicDomain: true
        }
      }
    );
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

export const requestInstance = async ({ domain }: { domain: string }) => {
  try {
    const body = {
      client_name: domain,
      website: "https://channel.org",
      redirect_uris: DEFAULT_REDIRECT_URI,
      scopes: "read write follow push"
    };

    const res: AxiosResponse<InstanceResponse> = await axios.post(
      `https://${domain}/api/v1/apps`,
      body
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const authorizeInstance = async (payload: {
  code: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  domain: string;
}) => {
  try {
    const resp: AxiosResponse<InstanceAuthResponse> = await axiosInstance.post(
      `https://${payload.domain}/oauth/token`,
      payload
    );
    return resp.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
