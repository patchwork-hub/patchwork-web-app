import { getGifv } from "@/services/gifv/gifv"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGifv = (query: string) => useInfiniteQuery({
    queryKey: ['gifv'],
    queryFn: async ({ pageParam }) => getGifv(query, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: undefined,
})