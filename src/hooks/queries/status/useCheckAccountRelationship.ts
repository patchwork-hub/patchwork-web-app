import { useQuery } from '@tanstack/react-query';
import { AccountRelationship } from '@/types/status';
import { ErrorResponse } from '@/types/error';
import { checkAccountRelationship } from '@/services/status/account';
import { AxiosError } from 'axios';

export const useCheckAccountRelationship = ({ id, enabled }: { id: string, enabled: boolean }) => {
    return useQuery<AccountRelationship[], AxiosError<ErrorResponse>>({
        queryKey: ['accountRelationship', id],
        queryFn: () => checkAccountRelationship(id),
        enabled,
    });
};
