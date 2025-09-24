import { create } from 'zustand';

type LanguageState = {
    language: string;
    setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'en',
    setLanguage: (language) => set({ language }),
}));
