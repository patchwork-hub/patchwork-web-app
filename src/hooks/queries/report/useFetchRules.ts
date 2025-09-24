import { useQuery } from '@tanstack/react-query';
import { getRules } from '@/services/report/report';
import { ErrorResponse } from '@/types/error';
import { Rule } from '@/types/report';
import { AxiosError } from 'axios';

export const useFetchRules = () => {
    return useQuery<Rule[], AxiosError<ErrorResponse>>({
        queryKey: ['rules'],
        queryFn: getRules
    });
};
