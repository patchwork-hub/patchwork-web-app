import { getEmailStatus } from "@/services/notifications/notifications";
import { useQuery } from "@tanstack/react-query";

export const useGetEmailStatus = (enabled:boolean) => {
  return useQuery({
    queryKey: ["emailStatus"],
    queryFn: getEmailStatus,
    enabled,
  });
};
