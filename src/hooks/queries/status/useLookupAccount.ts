import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/error';
import { lookupAccount } from '@/services/status/account';
import { AxiosError } from 'axios';
import { Account } from '@/types/status';

export const useLookupAccount = (acct: string) => {
    return useQuery<Account, AxiosError<ErrorResponse>>({
        queryKey: ['lookupAccount', acct],
        queryFn: () => lookupAccount(acct),
        enabled: !!acct,
    });
};
