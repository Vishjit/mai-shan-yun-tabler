import { getEvents, logEvent, clearEvents } from "@/lib/analyticsStore";

export function computeDailyAnalytics() {
  const events = getEvents();
  const daily: Record<string, any> = {}; // { date: { revenue, items: {}, customers } }

  events.forEach((e) => {
    const date = new Date(e.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
    if (!daily[date]) daily[date] = { revenue: 0, items: {}, customers: 0 };

    if (e.type === "order_added") {
      daily[date].revenue += (e.price || 0) * (e.quantity || 1);
      if (!daily[date].items[e.itemId!]) daily[date].items[e.itemId!] = 0;
      daily[date].items[e.itemId!] += e.quantity || 1;
    } else if (e.type === "order_removed") {
      daily[date].revenue -= (e.price || 0) * (e.quantity || 1);
      if (!daily[date].items[e.itemId!]) daily[date].items[e.itemId!] = 0;
      daily[date].items[e.itemId!] -= e.quantity || 1;
    } else if (e.type === "table_closed") {
      daily[date].customers += 1;
    }
  });

  return daily;
}