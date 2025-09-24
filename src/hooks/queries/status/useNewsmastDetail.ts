import { useQuery } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/error";
import { newsmastDetail } from "@/services/status/account";
import { AxiosError } from "axios";
import { Account } from "@/types/status";

export const useNewsmastDetail = (acct: string) => {
  return useQuery<Account, AxiosError<ErrorResponse>>({
    queryKey: ["lookupAccount", acct],
    queryFn: () => newsmastDetail(acct),
    enabled: !!acct,
  });
};
