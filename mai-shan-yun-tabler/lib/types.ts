export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Ticket = {
  id: string;
  tableNumber: number;
  items: OrderItem[];
};
