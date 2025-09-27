import {
  authorizeInstance,
  requestInstance,
  searchServerInstance
} from "@/services/auth/searchServer";
import {
  InstanceAuthResponse,
  InstanceResponse,
  SearchServerInstanceQueryKey
} from "@/types/auth";
import { DEFAULT_API_URL } from "@/utils/constant";
import {
  useMutation,
  UseMutationOptions,
  useQuery
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSearchServerInstance = ({
  domain = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL || "",
  enabled
}: {
  domain?: string;
  enabled?: boolean;
} = {}) => {
  const queryKey: SearchServerInstanceQueryKey = [
    "search-server-instance",
    { domain }
  ];
  return useQuery({
    queryKey,
    queryFn: () => searchServerInstance(domain),
    enabled
  });
};

export const useRequestPermissionToInstanceMutation = (
  options: UseMutationOptions<
    InstanceResponse,
    AxiosError,
    {
      domain: string;
    }
  >
) => {
  return useMutation({
    mutationFn: async (args: { domain: string }) => {
      const result = await requestInstance(args);
      if (!result) {
        throw new Error("No response from requestInstance");
      }
      return result;
    },
    ...options
  });
};

export const useAuthorizeInstanceMutation = (
  options: UseMutationOptions<
    InstanceAuthResponse,
    AxiosError,
    {
      code: string;
      grant_type: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
      domain: string;
    }
  >
) => {
  return useMutation({ mutationFn: authorizeInstance, ...options });
};
