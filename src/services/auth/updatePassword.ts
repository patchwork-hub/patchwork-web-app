import axiosInstance from "@/lib/http";
import { AxiosResponse } from "axios";

export const updatePassword = async (params: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: string }> = await axiosInstance.post(
      `/api/v1/custom_passwords/change_password`,
      {
        current_password: params.current_password,
        password: params.password,
        password_confirmation: params.password_confirmation
      }
    );
    return resp.data;
  } catch (error) {
    throw error;
  }
};
