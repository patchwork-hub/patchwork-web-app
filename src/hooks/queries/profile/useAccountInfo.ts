import { accountInfo } from "@/services/profile/accountInfo";
import { ErrorResponse } from "@/types/error";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useAccountInfo = (id: string) => {
  return useQuery<Account, AxiosError<ErrorResponse>>({
    queryKey: ["get_account_info", id],
    queryFn: () => accountInfo(id),
    enabled: Boolean(id),
  });
};
