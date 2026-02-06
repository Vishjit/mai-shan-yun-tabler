//we can modify the status types as needed
export type TableStatus = "available" | "ordering" | "alert";

// Items to order interface
export interface OrderItem {
  itemId: number;
  name: string;
  quantity: number;
  price?: number;
}

// Table interface
export interface Table {
  id: number;
  status: TableStatus;
  orders: OrderItem[];
  allergies: string[];
}

// Initial mock table array
export const tables: Table[] = [
  { id: 1, status: "available", orders: [], allergies: [] },
  { id: 2, status: "ordering", orders: [], allergies: ["nuts"] },
  { id: 3, status: "alert", orders: [], allergies: [] },
];