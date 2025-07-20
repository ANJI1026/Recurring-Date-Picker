import toast from "react-hot-toast";
import { useRecurrenceStore } from "../store/useRecurrenceStore";
import { createEvent } from "ics";

export const exportAsJSON = () => {
  const state = useRecurrenceStore.getState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "recurrence.json";
  link.click();
  toast("📁 Exported as JSON", { icon: "✅" });
};

export const exportToAPI = async () => {
  const state = useRecurrenceStore.getState();
  try {
    const res = await fetch("/api/recurrence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (res.ok) {
      toast.success("🎉 Sent to API successfully!");
    } else {
      toast.error("❌ API Error");
    }
  } catch (error) {
    toast.error("⚠️ API request failed");
  }
};

export const exportAsICS = () => {
  const { selectedDays, frequency } = useRecurrenceStore.getState();
  const now = new Date();

  const event = {
    start: [now.getFullYear(), now.getMonth() + 1, now.getDate(), 10, 0],
    duration: { hours: 1 },
    title: "Recurring Event",
    description: `Repeats every ${frequency} on ${selectedDays
      .map((i) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i])
      .join(", ")}`,
    status: "CONFIRMED",
    busyStatus: "BUSY",
    productId: "your-app",
  };

  createEvent(event, (error, value) => {
    if (error) return console.error(error);

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "recurrence-event.ics";
    link.click();
    toast("📆 Exported as ICS", { icon: "✅" });
  });
};
