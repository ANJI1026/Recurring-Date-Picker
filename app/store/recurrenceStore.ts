import { create } from "zustand";

type FrequencyUnit = "days" | "weeks" | "months" | "years";

interface RecurrenceState {
  frequencyValue: number;
  frequencyUnit: FrequencyUnit;
  selectedDays: number[];
  setFrequencyValue: (val: number) => void;
  setFrequencyUnit: (unit: FrequencyUnit) => void;
  toggleDay: (day: number) => void;
}

export const useRecurrenceStore = create<RecurrenceState>((set) => ({
  frequencyValue: 1,
  frequencyUnit: "weeks",
  selectedDays: [],

  setFrequencyValue: (val) => set({ frequencyValue: val }),
  setFrequencyUnit: (unit) => set({ frequencyUnit: unit }),
  toggleDay: (day) =>
    set((state) => ({
      selectedDays: state.selectedDays.includes(day)
        ? state.selectedDays.filter((d) => d !== day)
        : [...state.selectedDays, day],
    })),
}));
