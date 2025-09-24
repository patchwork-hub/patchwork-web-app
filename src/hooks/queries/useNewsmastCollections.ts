import { getNewsmastCollections } from "@/services/home-feed/getNewsmastCollections";
import { GetNewsmastCollectionListQueryKey } from "@/types/queries/channel.type";
import { useQuery } from "@tanstack/react-query";

export const useNewsmastCollections = (options?: { enabled: boolean }) => {
  const queryKey: GetNewsmastCollectionListQueryKey = [
    "newsmast-collection-list",
  ];
  return useQuery({
    queryKey,
    queryFn: getNewsmastCollections,
    enabled: options?.enabled,
  });
};
