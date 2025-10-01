import axiosInstance from "@/lib/http";
import { createSchemas } from "@/lib/schema/validations";
import { AxiosResponse } from "axios";
import { z } from "zod";
type SignUpForm = z.infer<ReturnType<typeof createSchemas>["SignUpFormSchema"]> & {
  email: string;
  username: string;
  password: string;
  agreement: boolean;
  locale: string;
  access_token: string;
}

export const signUp = async ({
  email,
  username,
  password,
  agreement,
  locale,
}: SignUpForm) => {
  const body = {
    email,
    username,
    password,
    agreement,
    locale,
  };

  //TODO: refactor url later
  try {
    const { data } = await axiosInstance.post("/api/v1/accounts", body);
    return data;
  } catch (error) {
    console.error("::=>", error);
    throw error;
  }
};

//TODO: Refactor later
const apiURL = process.env.NEXT_PUBLIC_API_URL;
// const apiURL = `https://mastodon.newsmast.org`;

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
// const redirect_uri = "urn:ietf:wg:oauth:2.0:oob";
const scope = "read write follow push profile";
const grant_type = "client_credentials";

export const getAppToken = async () => {
  try {
    const { data } = await axiosInstance.post(
      `${apiURL}/oauth/token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&scope=${scope}&grant_type=${grant_type}`
    );
    return data;
  } catch (error) {
    console.error("::=>", error);
    throw error;
  }
};

// TODO: response data need to update
export const signupVerifyOTP = async (params: {
  id: string;
  otp_secret: string;
}) => {
  try {
    const resp: AxiosResponse<{
      message: {
        access_token: string;
        token_type: string;
        scope: string;
        created_at: string;
      };
    }> = await axiosInstance.post(`/api/v1/custom_passwords/verify_otp`, {
      ...params,
      is_reset_password: false,
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

//TODO: response data need to update
export const signupRequestOTP = async (params: { id: string }) => {
  try {
    const resp: AxiosResponse<{
      message: {
        access_token: string;
        token_type: string;
        scope: string;
        created_at: string;
      };
    }> = await axiosInstance.post(`/api/v1/custom_passwords/request_otp`, {
      ...params,
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};
