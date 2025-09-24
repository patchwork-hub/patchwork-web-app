import { Schedule } from "@/types/schedule";
import { create } from "zustand";

export type ScheduleState = {
    schedule: Schedule | undefined;
    setSchedule: (schedule: Schedule) => void;
    removeSchedule: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    schedule: undefined,
    setSchedule: (schedule) => set({ schedule }),
    removeSchedule: () => set({ schedule: undefined }),
}));