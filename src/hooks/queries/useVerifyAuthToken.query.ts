import {
  getNewsmastUserInfo,
  verifyAuthToken
} from "@/services/auth/verifyAuthToken";
import {
  GetNewsmastAccountlDetailQueryKey,
  VerifyAuthTokenQueryKey
} from "@/types/queries/auth.type";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useVerifyAuthToken = ({ enabled }: { enabled?: boolean }) => {
  const queryKey: VerifyAuthTokenQueryKey = ["verify-auth-token"];
  return useQuery<Account, AxiosError<{ error: string }>>({
    queryKey,
    queryFn: verifyAuthToken,
    enabled,
    retry: false
  });
};

export const useGetNewsmastAccountDetail = ({
  options,
  ...queryParam
}: GetNewsmastAccountlDetailQueryKey[1] & {
  options?: QueryOptionHelper<Account | undefined>;
}) => {
  const queryKey: GetNewsmastAccountlDetailQueryKey = [
    "newsmast-account-detail",
    queryParam
  ];
  return useQuery({
    queryKey,
    queryFn: getNewsmastUserInfo,
    ...options
  });
};
