import { getGifv } from "@/services/gifv/gifv"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGifv = (query: string) => useInfiniteQuery({
    queryKey: ['gifv'],
    queryFn: async (context: { pageParam: string | undefined }) => {
        return getGifv(query, context.pageParam??"");
    },
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: undefined as string | undefined,
})