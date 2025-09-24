"use client";
import { fetchAccountsInList } from "@/services/list/fetchAccountsInLists";
import { AccountInListQueryKey } from "@/types/queries/lists.type";
import { useQuery } from "@tanstack/react-query";

export const useAccountsInList = ({
  id,
  domain_name,
}: AccountInListQueryKey[1]) => {
  const queryKey: AccountInListQueryKey = [
    "accounts-in-list",
    { id, domain_name },
  ];
  return useQuery({
    queryKey,
    queryFn: fetchAccountsInList,
    enabled: !!id,
  });
};
