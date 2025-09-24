import { fetchSearchMember } from "@/services/members/fetchSearchMembers";
import { useQuery } from "@tanstack/react-query";

export const useSearchAccounts = (searchTerm: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["searchAccounts", searchTerm],
    queryFn: () => fetchSearchMember(searchTerm, "accounts"),
    enabled: enabled && !!searchTerm,
  });
};
