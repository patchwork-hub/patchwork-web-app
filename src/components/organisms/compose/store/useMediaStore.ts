import { Media } from '@/types/status';
import { create } from 'zustand';

type MediaState = {
    media: Media[];
    mediaLocalUrls: string[];
    altTexts: string[];
    isSensitive: boolean;
    setMedia: (media: Media[]) => void;
    setMediaLocalUrls: (mediaLocalUrls: string[]) => void;
    setAltTexts: (altTexts: string[]) => void;
    setIsSensitive: (isSensitive: boolean) => void;
    uploading: boolean[];
    setUploading: (uploading: boolean[]) => void;
    mediaAttributes: Partial<Media>[],
    setMediaAttributes: (attributes: Partial<Media>[]) => void;
    reset: () => void;
};

export const useMediaStore = create<MediaState>((set) => ({
    mediaLocalUrls: [],
    altTexts: [],
    isSensitive: false,
    setMediaLocalUrls: (medias) => set({ mediaLocalUrls: medias }),
    setAltTexts: (altTexts) => set({ altTexts }),
    setIsSensitive: (isSensitive) => set({ isSensitive }),
    media: [],
    setMedia: (media) => set({ media }),
    reset: () => set({ mediaLocalUrls: [], altTexts: [], isSensitive: false, media: [], uploading: [], mediaAttributes:[] }),
    uploading: [],
    setUploading: (uploading) => set({ uploading }),
    mediaAttributes: [],
    setMediaAttributes: (mediaAttributes) => set({ mediaAttributes })
}));
