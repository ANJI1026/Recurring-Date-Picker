"use client";

import { useRecurrenceStore } from "../../store/useRecurrenceStore";

const options = ["daily", "weekly", "monthly", "yearly"];

export default function RecurrenceOptions() {
  const frequency = useRecurrenceStore((s) => s.frequency);
  const setFrequency = useRecurrenceStore((s) => s.setFrequency);

  return (
    <div className="flex gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setFrequency(opt as any)}
          className={`px-4 py-2 rounded-full border ${
            frequency === opt
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}
