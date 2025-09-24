import { create } from "zustand";

export type FCMState = {
    message: any;
    setMessage: (message: any) => void;
}

export const useFCMStore = create<FCMState>((set)=>({
    message: undefined,
    setMessage: (message) => set({message})
}))