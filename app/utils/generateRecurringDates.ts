import { add, isBefore, isSameDay } from "date-fns";

export function generateRecurringDates({
  startDate,
  endDate,
  frequencyValue,
  frequencyUnit,
  selectedDays,
}: {
  startDate?: Date;
  endDate?: Date;
  frequencyValue: number;
  frequencyUnit: "days" | "weeks" | "months" | "years";
  selectedDays: number[]; // if applicable
}): Date[] {
  if (!startDate) return [];

  const result: Date[] = [];
  let current = new Date(startDate);
  const limit = endDate ?? new Date(current.getFullYear() + 1, 0, 1); // default 1-year limit

  while (current <= limit) {
    result.push(new Date(current));

    switch (frequencyUnit) {
      case "days":
        current.setDate(current.getDate() + frequencyValue);
        break;
      case "weeks":
        current.setDate(current.getDate() + frequencyValue * 7);
        break;
      case "months":
        current.setMonth(current.getMonth() + frequencyValue);
        break;
      case "years":
        current.setFullYear(current.getFullYear() + frequencyValue);
        break;
    }
  }

  return result;
}
