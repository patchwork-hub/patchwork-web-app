"use client";
import { fetchSingleList } from "@/services/list/fetchSingleList";
import { SingleListQueryKey } from "@/types/queries/lists.type";
import { useQuery } from "@tanstack/react-query";

export const useSingleList = ({ id, domain_name }: SingleListQueryKey[1]) => {
  const queryKey: SingleListQueryKey = ["single-list", { id, domain_name }];
  return useQuery({
    queryKey,
    queryFn: fetchSingleList,
    enabled: !!id,
    staleTime:0,
    gcTime:0
  });
};
