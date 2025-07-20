"use client";

import { useState } from "react";
import { format, add, isBefore, isSameDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRecurrenceStore } from "../store/recurrenceStore";
import toast from "react-hot-toast";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecurringPicker() {
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
  const [previewDates, setPreviewDates] = useState<Date[]>([]);
  const [showPreview, setShowPreview] = useState(false); // 👈 Add preview toggle

  const applyRecurrence = () => {
    if (!startDate) {
      toast.error("Please select a start date.");
      return;
    }

    const actualEndDate = endDate ?? add(startDate, { [frequencyUnit]: 10 });
    let current = startDate;
    const dates: Date[] = [];

    while (
      isBefore(current, actualEndDate) ||
      isSameDay(current, actualEndDate)
    ) {
      if (
        selectedDays.length === 0 ||
        selectedDays.includes(current.getDay())
      ) {
        dates.push(current);
      }
      current = add(current, { [frequencyUnit]: frequencyValue });
    }

    setPreviewDates(dates.slice(0, 100));
    setShowPreview(true); // ✅ Show calendar only after apply
    toast.success("Recurring dates applied!");
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setPreviewDates([]);
    setShowPreview(false); // ❌ Hide calendar on reset
    toast("Reset complete.");
  };

  const handleExportJSON = () => {
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
    toast.success("Exported as JSON!");
  };

  const handleExportICS = () => {
    if (!startDate) return toast.error("Start date required");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    previewDates.forEach((date, i) => {
      const dt = format(date, "yyyyMMdd");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${i}@recurringpicker.app`,
        `DTSTAMP:${dt}T000000Z`,
        `DTSTART;VALUE=DATE:${dt}`,
        `SUMMARY:Recurring Event`,
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recurring.ics";
    a.click();
    toast.success("Exported as .ics file");
  };

  const isDateSelected = (date: Date) =>
    previewDates.some((d) => isSameDay(d, date));

  return (
    <div className="w-full max-w-xl bg-zinc-900 text-white p-6 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">📅 Recurring Date Picker</h2>

      {/* Date Range */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select a date"
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date (optional)</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select a date"
            isClearable
            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
          />
        </div>
      </div>

      {/* Frequency */}
      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm">Repeat every</label>
        <input
          type="number"
          min={1}
          value={frequencyValue}
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
          <option value="days">Day's</option>
          <option value="weeks">Week's</option>
          <option value="months">Month's</option>
          <option value="years">Year's</option>
        </select>
      </div>

      {/* Day Selector */}
      <div className="mt-4">
        <label className="text-sm block mb-2">Select Days</label>
        <div className="flex gap-2 flex-wrap">
          {dayLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              className={`transition-all duration-200 hover:scale-105 px-3 py-1 rounded-full border text-sm ${
                selectedDays.includes(i)
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

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={applyRecurrence}
          className="transition hover:scale-105 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="transition hover:scale-105 px-4 py-2 bg-zinc-700 hover:bg-zinc-800 rounded text-white"
        >
          Reset
        </button>
        <button
          onClick={handleExportJSON}
          className="transition hover:scale-105 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Export as JSON
        </button>
        <button
          onClick={handleExportICS}
          className="transition hover:scale-105 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Export .ICS
        </button>
      </div>

      {/* Mini Calendar Preview (Shown Only If Applied) */}
      {showPreview && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">📆 Mini Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              if (!startDate) return null;
              const day = add(startDate, { days: i });
              return (
                <div
                  key={i}
                  className={`transition-all duration-200 text-center text-sm px-2 py-1 rounded border
                    ${
                      isDateSelected(day)
                        ? "bg-green-600 text-white border-green-700 scale-105"
                        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:scale-105"
                    }`}
                >
                  {format(day, "dd")}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
