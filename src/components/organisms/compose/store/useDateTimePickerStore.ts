import { create } from "zustand";

interface DateTimePickerState {
  isDateOpen: boolean;
  setIsDateOpen: (value: boolean) => void;
}

export const useDateTimePickerStore = create<DateTimePickerState>((set) => ({
  isDateOpen: false,
  setIsDateOpen: (value) => set({ isDateOpen: value }),
}));
