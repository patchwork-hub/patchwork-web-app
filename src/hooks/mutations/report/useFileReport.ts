import { useMutation } from '@tanstack/react-query';
import { fileReport } from '@/services/report/report';
import { ErrorResponse } from '@/types/error';
import { Report } from '@/types/report';
import { AxiosError } from 'axios';

export const useFileReport = () => {
    return useMutation<Report, AxiosError<ErrorResponse>, Parameters<typeof fileReport>[0]>({
        mutationFn: fileReport,
        mutationKey: ['report']
    });
}