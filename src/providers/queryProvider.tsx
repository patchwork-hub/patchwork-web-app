"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { LocaleProvider } from "./localeProvider";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: () => {
      // console.log(query);
    },
    onError: (error) => {
      console.log('QueryCacheError:', error);
    }
  }),
  mutationCache: new MutationCache({
    onSuccess: () => {
      // console.log('MutationCacheSuccess:', query);
    },
    onError: () => {
      // console.error('MutationCacheError', error);
    }
  }),
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minutes
      retry: 1,
      refetchOnWindowFocus: false
    },
  },
});

const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
      {children}
      </LocaleProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
