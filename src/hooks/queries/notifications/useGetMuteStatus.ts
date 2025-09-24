import { getMuteStatus } from "@/services/notifications/notifications";
import { useQuery } from "@tanstack/react-query";

export const useGetMuteStatus = () => {
  return useQuery({
    queryKey: ["muteStatus"],
    queryFn: getMuteStatus
  });
};
