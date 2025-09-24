

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PreferencesResponse, ApiError } from '@/types/preferences';
import { getUserPreferences } from '@/services/locale/preferences';


export const PREFERENCES_QUERY_KEY = 'user-preferences';

export function useUserPreferences(
  token?: string | boolean,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<PreferencesResponse, ApiError> {
  return useQuery<PreferencesResponse, ApiError>({
    queryKey: [PREFERENCES_QUERY_KEY],
    queryFn: () => {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      return getUserPreferences();
    },
    enabled: options?.enabled !== false && !!token,
  });
}