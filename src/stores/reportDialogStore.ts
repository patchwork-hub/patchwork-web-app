import { Account, Status } from '@/types/status';
import { create } from 'zustand';

type ReportDialogState = {
    isOpen: boolean;
    account?: Account;
    status?: Status;
    openDialog: (payload: { account?: Account; status?: Status }) => void;
    closeDialog: () => void;
};

export const useReportDialogStore = create<ReportDialogState>((set) => ({
    isOpen: false,
    account: undefined,
    status: undefined,
    openDialog: ({ account, status }) => set({ isOpen: true, account, status }),
    closeDialog: () => set({ isOpen: false, account: undefined, status: undefined }),
}));
