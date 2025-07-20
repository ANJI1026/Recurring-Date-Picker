import { generateRecurringDates } from "../utils/generateRecurringDates";
import { addDays, format } from "date-fns";

describe("generateRecurringDates", () => {
  it("should generate correct dates for daily recurrence", () => {
    const startDate = new Date("2025-07-20");
    const endDate = addDays(startDate, 5); // 6 days total

    const result = generateRecurringDates({
      startDate,
      endDate,
      frequencyValue: 1,
      frequencyUnit: "days",
      selectedDays: [],
    });

    // Validate length
    expect(result.length).toBe(6);

    // Validate the first and last dates
    expect(format(result[0], "yyyy-MM-dd")).toBe("2025-07-20");
    expect(format(result[5], "yyyy-MM-dd")).toBe("2025-07-25");
  });

  it("should return empty array if startDate is missing", () => {
    const result = generateRecurringDates({
      startDate: undefined,
      endDate: undefined,
      frequencyValue: 1,
      frequencyUnit: "days",
      selectedDays: [],
    });

    expect(result).toEqual([]);
  });

  it("should generate correct dates for every 2 days", () => {
    const startDate = new Date("2025-07-20");
    const endDate = addDays(startDate, 6); // Should get 4 dates: 20, 22, 24, 26

    const result = generateRecurringDates({
      startDate,
      endDate,
      frequencyValue: 2,
      frequencyUnit: "days",
      selectedDays: [],
    });

    const formatted = result.map((date) => format(date, "yyyy-MM-dd"));
    expect(formatted).toEqual([
      "2025-07-20",
      "2025-07-22",
      "2025-07-24",
      "2025-07-26",
    ]);
  });
});
