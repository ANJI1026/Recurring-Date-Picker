"use client";
import { useRecurrenceStore } from "../store/useRecurrenceStore";
import { format, addDays } from "date-fns";

export default function RecurrencePreview() {
  const { recurrence, startDate, endDate } = useRecurrenceStore();

  const getDates = () => {
    if (!startDate) return [];
    const dates = [];
    let current = new Date(startDate);
    const until = endDate
      ? new Date(endDate)
      : addDays(new Date(startDate), 30);

    while (current <= until) {
      dates.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, parseInt(recurrence.interval || "1", 10));
    }

    return dates;
  };

  const dates = getDates();

  return (
    <div className="mt-4 p-4 border rounded shadow-sm w-full">
      <h3 className="text-lg font-semibold mb-2">Recurring Dates</h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
        {dates.map((d) => (
          <li
            key={d}
            className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-center"
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
