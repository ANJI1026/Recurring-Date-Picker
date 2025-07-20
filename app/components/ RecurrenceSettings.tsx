"use client";

import { useRecurrenceStore } from "@/app/store/useRecurrenceStore";
import { cn } from "@/app/utils/cn";

const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function RecurrenceSettings() {
  const { frequency, interval, setFrequency, setInterval } =
    useRecurrenceStore();

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg space-y-6 border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
        Recurrence Settings
      </h2>

      {/* Frequency Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-2">
          {frequencyOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFrequency(option)}
              className={cn(
                "py-2 px-4 rounded-full text-sm font-medium border transition",
                frequency === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Interval Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Repeat every
        </label>
        <input
          type="number"
          min={1}
          value={interval}
          onChange={(e) => setInterval(parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
