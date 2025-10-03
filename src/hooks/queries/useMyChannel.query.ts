import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getMyChannel } from "@/services/home-feed/myChannelService";
import type { MyChannel } from "@/types/patchwork";
import type { GetMyChannelQueryKey } from "@/types/queries/channel.type";

type QueryOptions = Omit<
  UseQueryOptions<
    MyChannel,
    AxiosError,
    MyChannel,
    GetMyChannelQueryKey
  >,
  "queryKey" | "queryFn"
>;

export const useMyChannel = (
  queryParam: GetMyChannelQueryKey[1],
  options?: QueryOptions
): UseQueryResult<MyChannel, AxiosError> => {
  const queryKey: GetMyChannelQueryKey = ["my-channel", queryParam];

  return useQuery({
    queryKey,
    queryFn: getMyChannel,
    retry: false,
    ...options,
  });
};