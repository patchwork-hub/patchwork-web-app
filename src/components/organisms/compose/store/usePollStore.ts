import { create } from 'zustand';
import { POLL_INITIAL } from '../types';

type PollState = {
    pollOptions: string[];
    pollChoiceType: 'single' | 'multiple';
    pollDuration: number;
    setPollOptions: (options: string[]) => void;
    setPollChoiceType: (choiceType: 'single' | 'multiple') => void;
    setPollDuration: (duration: number) => void;
};

export const usePollStore = create<PollState>((set) => ({
    pollOptions: POLL_INITIAL.options,
    pollChoiceType: POLL_INITIAL.multiple ? 'multiple' : 'single',
    pollDuration: POLL_INITIAL.expires_in,
    setPollOptions: (options) => set({ pollOptions: options }),
    setPollChoiceType: (choiceType) => set({ pollChoiceType: choiceType }),
    setPollDuration: (duration) => set({ pollDuration: duration }),
}));
