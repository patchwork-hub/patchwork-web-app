import axiosInstance from '@/lib/http';
import { ApiError } from '@/types/locale';
import { PreferencesResponse } from '@/types/preferences';


export async function getUserPreferences(): Promise<PreferencesResponse> {
  try {
    const response = await axiosInstance.get<PreferencesResponse>(
      '/api/v1/preferences',
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to fetch preferences',
      code: error.response?.status,
      details: error.response?.data,
    };
    throw apiError;
  }
}