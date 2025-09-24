import { fetchHashtagDetail } from "@/services/hashtag/fetchHashtagDetail";
import { HashtagDetailQueryKey } from "@/types/queries/hashtag.type";
import { useQuery } from "@tanstack/react-query";

export const useHashTagDetailQuery = ({
  domain_name,
  hashtag,
}: HashtagDetailQueryKey[1]) => {
  const queryKey: HashtagDetailQueryKey = [
    "hashtag-detail",
    { domain_name, hashtag },
  ];
  return useQuery({ queryKey, queryFn: fetchHashtagDetail });
};
