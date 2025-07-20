"use client";

import { useState } from "react";
import { format, add, isBefore } from "date-fns";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRecurrenceStore } from "../store/recurrenceStore";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecurringDatePicker() {
  const {
    frequencyValue,
    frequencyUnit,
    selectedDays,
    setFrequencyValue,
    setFrequencyUnit,
    toggleDay,
  } = useRecurrenceStore();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [previewDates, setPreviewDates] = useState<string[]>([]);

  const applyRecurrence = () => {
    if (!startDate) {
      toast.error("Please select a start date.");
      return;
    }

    const actualEndDate = endDate ?? add(startDate, { [frequencyUnit]: 10 });
    let current = startDate;
    const dates: string[] = [];

    while (
      isBefore(current, actualEndDate) ||
      current.toDateString() === actualEndDate.toDateString()
    ) {
      if (
        selectedDays.length === 0 ||
        selectedDays.includes(current.getDay())
      ) {
        dates.push(format(current, "EEE, MMM d"));
      }
      current = add(current, { [frequencyUnit]: frequencyValue });
    }

    setPreviewDates(dates.slice(0, 10));
    toast.success(`Recurring dates applied.`);
  };

  return (
    <div className="w-full max-w-xl bg-zinc-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📅 Recurring Date Picker</h2>

      {/* Start and End Date */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date (optional)</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
            placeholderText="Select end date"
            isClearable
          />
        </div>
      </div>

      {/* Frequency Input */}
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm">Repeat every</label>
        <input
          type="number"
          value={frequencyValue}
          min={1}
          onChange={(e) => setFrequencyValue(Number(e.target.value))}
          className="w-16 px-2 py-1 rounded bg-zinc-800 border border-zinc-700"
        />
        <select
          value={frequencyUnit}
          onChange={(e) =>
            setFrequencyUnit(
              e.target.value as "days" | "weeks" | "months" | "years"
            )
          }
          className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700"
        >
          <option value="days">days</option>
          <option value="weeks">weeks</option>
          <option value="months">months</option>
          <option value="years">years</option>
        </select>
      </div>

      {/* Weekday Selection */}
      <div className="mt-4">
        <label className="text-sm block mb-2">Select Days</label>
        <div className="flex gap-2 flex-wrap">
          {dayLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedDays.includes(index)
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-zinc-800 border-zinc-700 text-white"
              }`}
              title={label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-start">
        <button
          onClick={applyRecurrence}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            toast("Reset complete.");
          }}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 rounded text-white"
        >
          Reset
        </button>
        <button
          onClick={() => {
            const config = {
              startDate,
              endDate,
              frequencyValue,
              frequencyUnit,
              selectedDays,
            };
            const blob = new Blob([JSON.stringify(config, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recurrence.json";
            a.click();
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Export as JSON
        </button>
        <button
          onClick={() => toast.success("ICS export not implemented yet")}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Export .ICS
        </button>
      </div>

      {/* Preview */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upcoming Dates</h3>
        <div className="flex flex-wrap gap-2">
          {previewDates.length > 0 ? (
            previewDates.map((date, i) => (
              <div
                key={i}
                className="bg-zinc-800 px-3 py-1 rounded text-sm border border-zinc-600"
              >
                {date}
              </div>
            ))
          ) : (
            <span className="text-zinc-400">No dates yet. Click Apply.</span>
          )}
        </div>
      </div>
    </div>
  );
}
