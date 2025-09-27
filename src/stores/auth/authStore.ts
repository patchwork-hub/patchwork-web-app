import { Account } from "@/types/account";
import { DEFAULT_API_URL } from "@/utils/constant";
import { ensureHttp } from "@/utils/helper/helper";
import Cookies from "js-cookie";
import { SetStateAction } from "react";
import { create } from "zustand";

export type AuthState = {
  access_token: string | undefined;
  userInfo: Account | undefined;
  userOriginInstance: string;
  isSignInWithMastodon: boolean;
  actions: {
    setAuthToken: (token: string) => void;
    clearAuthState: () => void;
    setUserInfo: (user: Account) => void;
    setUserOriginInstance: (userOrigin: string) => void;
    setSignInWithMastodon: (isMastodon: SetStateAction<boolean>) => void;
  };
};

const default_instance = Cookies.get("domain") ?? DEFAULT_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  access_token: undefined,
  userInfo: undefined,
  userOriginInstance: default_instance,
  isSignInWithMastodon: false,
  actions: {
    setAuthToken: (token) =>
      set((state) => ({ ...state, access_token: token })),
    clearAuthState: () =>
      set((state) => ({
        ...state,
        access_token: undefined,
        userOriginInstance: default_instance,
      })),
    setUserInfo: (user: Account) =>
      set((state) => ({ ...state, userInfo: user })),
    setUserOriginInstance: (domain: string) =>
      set((state) => ({ ...state, userOriginInstance: ensureHttp(domain) })),
    setSignInWithMastodon: (action: SetStateAction<boolean>) =>
      set((state) => ({
        ...state,
        isSignInWithMastodon:
          typeof action === "function"
            ? action(state.isSignInWithMastodon) 
            : action, 
      })),
  },
}));

export const useAuthStoreAction = () => useAuthStore((state) => state.actions);
