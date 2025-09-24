import { useQuery } from "@tanstack/react-query";
import { getContext } from "@/services/status/statuses";
import { ErrorResponse } from "@/types/error";
import { Context } from "@/types/status";
import { AxiosError } from "axios";

export const useGetContext = (id: string, domain?: string) => {
  return useQuery<Context, AxiosError<ErrorResponse>>({
    queryKey: ["context", id],
    enabled: !!id,
    queryFn: () => getContext(id, domain),
  });
};
