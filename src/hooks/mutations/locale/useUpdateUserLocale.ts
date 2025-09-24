'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { UserLocaleParams, UserLocaleResponse, ApiError } from '@/types/locale';
import { updateUserLocale } from '@/services/locale/locale';

interface UseUpdateUserLocaleOptions {
  onSuccess?: (data: UserLocaleResponse, variables: UserLocaleParams) => void;
  onError?: (error: ApiError, variables: UserLocaleParams) => void;
  onSettled?: (data: UserLocaleResponse | undefined, error: ApiError | null, variables: UserLocaleParams) => void;
}

export function useUpdateUserLocale(
  options?: UseUpdateUserLocaleOptions
): UseMutationResult<UserLocaleResponse, ApiError, UserLocaleParams> {
  return useMutation<UserLocaleResponse, ApiError, UserLocaleParams>({
    mutationFn: (params: UserLocaleParams) => updateUserLocale(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}