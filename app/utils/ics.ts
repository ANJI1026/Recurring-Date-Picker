export const formatICS = ({
  calendarDate,
  frequency,
  selectedDays,
}: {
  calendarDate: string;
  frequency: string;
  selectedDays: number[];
}) => {
  const dt = calendarDate.replace(/-/g, "");
  return `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  SUMMARY:Recurring Event
  DTSTART:${dt}
  RRULE:FREQ=${frequency.toUpperCase()};
  DESCRIPTION:Selected Days - ${selectedDays.join(", ")}
  END:VEVENT
  END:VCALENDAR`;
};
