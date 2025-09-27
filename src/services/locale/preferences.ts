import axiosInstance from '@/lib/http';
import { ApiError } from '@/types/locale';
import { PreferencesResponse } from '@/types/preferences';
import { isAxiosError } from 'axios';


export async function getUserPreferences(): Promise<PreferencesResponse> {
  try {
    const response = await axiosInstance.get<PreferencesResponse>(
      '/api/v1/preferences',
    );
    return response.data;
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