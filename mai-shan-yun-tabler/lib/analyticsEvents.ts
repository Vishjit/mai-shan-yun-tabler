export type AnalyticsEventType =
  | "order_added"
  | "order_removed"
  | "table_closed";

export interface AnalyticsEvent {
  id: string;           // unique
  type: AnalyticsEventType;
  timestamp: number;    // Date.now()
  tableId: number;
  itemId?: number;
  quantity?: number;
  price?: number;       // optional, future proof
}

export function createEvent(
  type: AnalyticsEventType,
  data: Omit<AnalyticsEvent, "id" | "timestamp" | "type">
): AnalyticsEvent {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: Date.now(),
    ...data,
  };
}