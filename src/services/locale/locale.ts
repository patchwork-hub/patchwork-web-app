import axiosInstance from '@/lib/http';
import { ApiError, UserLocaleParams, UserLocaleResponse } from '@/types/locale';
import { isAxiosError } from 'axios';


export async function updateUserLocale(
  params: UserLocaleParams,
): Promise<UserLocaleResponse> {
  try {
    const { data } = await axiosInstance.post<UserLocaleResponse>(
      '/api/v1/user_locales',
      params
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Failed to update locale',
        code: error.response?.status,
      };
      throw apiError;
    }
    
    const apiError: ApiError = {
      message: 'Failed to update locale',
      code: undefined,
    };
    throw apiError;
  }
}