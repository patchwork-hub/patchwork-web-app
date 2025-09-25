import { InfiniteData } from "@tanstack/react-query";

export type PagedResponse<T = unknown> = {
  data: T;
  links?: {
    prev?: { min_id: string };
    next?: { max_id: string };
  };
};

export const infinitePageParam = {
  getPreviousPageParam: <T>(firstPage: PagedResponse<T>) =>
    firstPage.links?.prev?.min_id,
  getNextPageParam: <T>(lastPage: PagedResponse<T>) => {
    return lastPage.links?.next?.max_id;
  },
};

export const flattenPages = <T>(
  data: InfiniteData<PagedResponse<T[]>> | undefined
): T[] | [] => {
  if (Array.isArray(data?.pages)) {
    return data?.pages.flatMap((page) => page.data) || [];
  }
  return [];
};
