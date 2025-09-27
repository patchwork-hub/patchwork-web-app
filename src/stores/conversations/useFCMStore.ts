import { create } from "zustand";

export type FCMState = {
    message: unknown;
    setMessage: (message: unknown) => void;
}

export const useFCMStore = create<FCMState>((set)=>({
    message: undefined,
    setMessage: (message) => set({message})
}))