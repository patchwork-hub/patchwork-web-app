import { DraftStatusItem } from "@/types/draft";
import { create } from "zustand";

export type DraftState = {
    isDirty: boolean;
    setIsDirty: (isDirty: boolean) => void;
    draft: DraftStatusItem | undefined;
    setDraft: (draft: DraftStatusItem) => void;
    removeDraft: () => void;
    saveAsDraftModalOpen: boolean;
    setSaveAsDraftModalOpen: (value: boolean) => void;
    navigateAction: () => void;
    setNavigateAction: (action: () => void) => void;
}

export const useDraftStore = create<DraftState>((set) => ({
    isDirty:false,
    setIsDirty: (isDirty) => set({ isDirty }),
    draft: undefined,
    setDraft: (draft) => set({ draft }),
    removeDraft: () => set({ draft: undefined }),
    saveAsDraftModalOpen: false,
    setSaveAsDraftModalOpen: (saveAsDraftModalOpen) => set({ saveAsDraftModalOpen }),
    navigateAction: () => {},
    setNavigateAction: (action) => set({ navigateAction: action }),
}));