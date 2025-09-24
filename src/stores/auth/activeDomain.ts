import { DEFAULT_API_URL } from "@/utils/constant";
import { ensureHttp } from "@/utils/helper/helper";
import { create } from "zustand";
type ActiveDomainComposeState = {
  domain_name: string;
  actions: {
    setDomain: (domain: string) => void;
    clearDomain: (domain: string) => void;
  };
};

export const useActiveDomainStore = create<ActiveDomainComposeState>((set) => ({
  domain_name: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
  actions: {
    setDomain: (domain) =>
      set((state) => {
        return { ...state, domain_name: ensureHttp(domain) };
      }),
    clearDomain: () => set((state) => ({ ...state, domain_name: "" })),
  },
}));

export const useSelectedDomain = () =>
  useActiveDomainStore((state) => state.domain_name);

export const useActiveDomainAction = () =>
  useActiveDomainStore((state) => state.actions);
