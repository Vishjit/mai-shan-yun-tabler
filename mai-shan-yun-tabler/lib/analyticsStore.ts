import { AnalyticsEvent } from "./analyticsEvents";

const KEY = "analytics_events";

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function logEvent(event: AnalyticsEvent) {
  const events = getEvents();
  events.push(event);
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function clearEvents() {
  localStorage.removeItem(KEY);
}