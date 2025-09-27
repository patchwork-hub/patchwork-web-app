import axiosInstance from "@/lib/http";
import { LoginResponse } from "@/types/auth";
import { AxiosResponse } from "axios";

export const forgotPassword = async (params: { email: string }) => {
  try {
    const { data } = await axiosInstance.post(`/api/v1/custom_passwords`, {
      email: params.email
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const forgetPasswordVerifyOTP = async (params: {
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
      is_reset_password: true
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const forgetEmailVerifyOTP = async (params: {
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
      is_change_email: true
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const changeNewsmastEmailVerification = async (params: {
  user_id: string;
  confirmed_otp_code: string;
}) => {
  try {
    const resp: AxiosResponse<{ message: LoginResponse }> =
      await axiosInstance.put(`/api/v1/users/verify_otp`, {
        confirmed_otp_code: params.confirmed_otp_code,
        user_id: params.user_id
      });
    return resp.data;
  } catch (error) {
    throw error;
  }
};
