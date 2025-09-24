import { create } from 'zustand';
import { LinkPreview } from '../types';

type LinkState = {
    preview: LinkPreview | undefined;
    setPreview: (preview: LinkPreview | undefined) => void;
};

export const useLinkStore = create<LinkState>((set) => ({
    preview: undefined,
    setPreview: (preview) => set({ preview }),
}));
