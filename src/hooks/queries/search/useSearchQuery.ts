import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';
import { searchQuery, SearchQueryParams, SearchQueryResponse } from '@/services/search/searchQuery';

export const useSearchQuery = ({ enabled, query, type, domain_name }: SearchQueryParams & { enabled: boolean }) => {
    return useQuery<SearchQueryResponse, AxiosError<ErrorResponse>>({
        queryKey: ['searchQuery', query, type],
        queryFn: () => searchQuery({ query, type, domain_name }),
        enabled,
    });
};
