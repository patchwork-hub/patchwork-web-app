import axiosInstance from "@/lib/http";
import { AxiosResponse } from "axios";

export const resetPassword = async (params: {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await axiosInstance.put(
      `/api/v1/custom_passwords/${params.reset_password_token}`,
      {
        password: params.password,
        password_confirmation: params.password_confirmation
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};
