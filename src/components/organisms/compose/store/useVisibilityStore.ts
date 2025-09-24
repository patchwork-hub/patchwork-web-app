import { create } from 'zustand';
import { Visibility } from '../types';

type VisibilityState = {
    visibility: Visibility;
    setVisibility: (visibility: Visibility) => void;
}

export const useVisibilityStore = create<VisibilityState>((set) => ({
    visibility: 'public',
    setVisibility: (visibility) => set({ visibility }),
}));
