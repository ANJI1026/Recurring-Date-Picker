"use client";

import { useState } from "react";
import { useRecurrenceStore } from "../store/useRecurrenceStore";
import { RadioGroup } from "@headlessui/react";
import { cn } from "../utils/cn";
import { toast } from "react-hot-toast";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ordinalOptions = ["First", "Second", "Third", "Fourth", "Last"];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function RecurrenceControls() {
  const {
    selectedDays,
    frequency,
    toggleDay,
    setFrequency,
    interval,
    setInterval,
    setNthWeekday,
    nthWeekday,
  } = useRecurrenceStore();

  const [nthOrdinal, setNthOrdinal] = useState("Second");
  const [nthDay, setNthDay] = useState("Tuesday");

  const handleExport = () => {
    const data = {
      frequency,
      interval,
      selectedDays,
      pattern: frequency === "monthly" ? `${nthOrdinal} ${nthDay}` : null,
    };

    toast.success("Exported as JSON");
    console.log("Exported:", data);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Frequency Selector */}
      <div>
        <label className="text-sm font-medium mb-1 block">Frequency</label>
        <div className="flex gap-3">
          {["daily", "weekly", "monthly", "yearly"].map((freq) => (
            <label key={freq} className="flex items-center gap-1">
              <input
                type="radio"
                value={freq}
                checked={frequency === freq}
                onChange={() => setFrequency(freq)}
              />
              <span className="capitalize">{freq}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interval Input */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Every X {frequency}
        </label>
        <input
          type="number"
          min={1}
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-zinc-800"
        />
      </div>

      {/* Weekly Selector */}
      {frequency === "weekly" && (
        <div>
          <label className="text-sm font-medium mb-1 block">Select Days</label>
          <div className="grid grid-cols-7 gap-2">
            {dayLabels.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                title={day}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-lg border",
                  selectedDays.includes(i)
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly: Pattern Selector */}
      {frequency === "monthly" && (
        <div className="space-y-2">
          <label className="text-sm font-medium block">Pattern</label>
          <div className="flex gap-2">
            <select
              value={nthOrdinal}
              onChange={(e) => setNthOrdinal(e.target.value)}
              className="w-full px-2 py-1.5 border rounded-md dark:bg-zinc-800"
            >
              {ordinalOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select
              value={nthDay}
              onChange={(e) => setNthDay(e.target.value)}
              className="w-full px-2 py-1.5 border rounded-md dark:bg-zinc-800"
            >
              {weekdays.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-zinc-500">
            Will repeat on{" "}
            <strong>
              {nthOrdinal} {nthDay}
            </strong>{" "}
            of every month.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
        >
          📁 Export JSON
        </button>
        <button
          onClick={() => {
            toast.success("Sent to API!");
          }}
          className="bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
        >
          🚀 Send to API
        </button>
      </div>
    </div>
  );
}
