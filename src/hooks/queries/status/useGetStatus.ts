import { useQuery } from "@tanstack/react-query";
import { getStatus } from "@/services/status/statuses";
import { Status } from "@/types/status";
import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";

export const useGetStatus = (id: string, domain?: string) => {
  return useQuery<Status, AxiosError<ErrorResponse>>({
    queryKey: ["status", id],
    queryFn: () => getStatus(id, domain),
    enabled: !!id,
  });
};
