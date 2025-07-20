import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecurrenceState = {
  selectedDays: number[];
  frequencyValue: number;
  frequencyUnit: "days" | "weeks" | "months" | "years";
  startDate: string | null;
  endDate: string | null;
  toggleDay: (day: number) => void;
  setFrequencyValue: (value: number) => void;
  setFrequencyUnit: (unit: "days" | "weeks" | "months" | "years") => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
};

export const useRecurrenceStore = create<RecurrenceState>()(
  persist(
    (set, get) => ({
      selectedDays: [],
      frequencyValue: 1,
      frequencyUnit: "weeks",
      startDate: null,
      endDate: null,
      toggleDay: (day) => {
        const current = get().selectedDays;
        set({
          selectedDays: current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day],
        });
      },
      setFrequencyValue: (value) => set({ frequencyValue: value }),
      setFrequencyUnit: (unit) => set({ frequencyUnit: unit }),
      setStartDate: (date) => set({ startDate: date }),
      setEndDate: (date) => set({ endDate: date }),
    }),
    { name: "recurrence-store" }
  )
);
