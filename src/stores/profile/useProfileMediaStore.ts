import { Asset } from "@/types/profile";
import { create } from "zustand";

export type MediaState = {
  mediaModal: boolean;
  selectedMedia: Asset[] | string;
};

type State = {
  header: MediaState;
  avatar: MediaState;
  actions: {
    onToggleMediaModal: (type: "header" | "avatar") => void;
    onSelectMedia: (type: "header" | "avatar", media: Asset[] | string) => void;
  };
};

export const useProfileMediaStore = create<State>((set) => ({
  header: {
    mediaModal: false,
    selectedMedia: []
  },
  avatar: {
    mediaModal: false,
    selectedMedia: []
  },
  actions: {
    onToggleMediaModal: (type) =>
      set((state) => ({
        [type]: {
          ...state[type],
          mediaModal: !state[type].mediaModal
        }
      })),
    onSelectMedia: (type, media) =>
      set((state) => ({
        [type]: {
          ...state[type],
          selectedMedia: media
        }
      }))
  }
}));

export const useProfileMediaActions = () =>
  useProfileMediaStore((state) => state.actions);
