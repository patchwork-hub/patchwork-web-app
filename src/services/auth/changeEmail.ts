import http from "@/lib/http";
import { AxiosResponse } from "axios";

export const changeEmail = async (params: {
  current_password: string;
  email: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: LoginResponse }> = await http.post(
      `/api/v1/custom_passwords/change_email`,
      {
        current_password: params.current_password,
        email: params.email
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const changeNewsmastEmail = async (params: {
  email: string;
  domain_name: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: LoginResponse }> = await http.put(
      `/api/v1/users/change_email_phone`,
      {
        user: {
          email: params.email
        }
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};
