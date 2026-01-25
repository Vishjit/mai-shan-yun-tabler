  // src/context/TicketContext.tsx
  "use client";

  import { createContext, useContext, useState, useRef, ReactNode } from "react";

  // Type definitions
  export type OrderItem = {
    id: string;       // unique menu item ID
    name: string;
    price: number;
    quantity: number;
  };

  export type Ticket = {
    id: number;       // unique ticket ID
    tableNumber: number;
    items: OrderItem[];
  };

  export type Receipt = {
    lines: {
      name: string;
      quantity: number;
      price: number;
      lineTotal: number;
    }[];
    subtotal: number;
  };

  // Context type
  type TicketContextType = {
    tickets: Ticket[];
    createTicket: (tableNumber: number, id?: number) => number;
    addItemToTicket: (ticketId: number, item: OrderItem) => void;
    updateItemQuantity: (ticketId: number, itemId: string, quantity: number) => void;
    removeItemFromTicket: (ticketId: number, itemId: string) => void;
    getTicketById: (ticketId: number) => Ticket | undefined;
    getReceiptForTicket: (ticketId: number) => Receipt | undefined;
  };

  // Create context
  const TicketContext = createContext<TicketContextType | null>(null);

  // Provider component
  export function TicketProvider({ children }: { children: ReactNode }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);  const ticketIdCounter = useRef(1);    const getReceiptForTicket = (ticketId: number): Receipt | undefined => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const lines = ticket.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    lineTotal: item.price * item.quantity,
  }));

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  return { lines, subtotal };
};


    // Create new ticket
    const createTicket = (tableNumber: number, id?: number) => {
      const ticketId = id ?? ticketIdCounter.current++;
      if (tickets.some(t => t.id === ticketId)) return ticketId; // already exists
      setTickets(t => [...t, { id: ticketId, tableNumber, items: [] }]);
      return ticketId;
    };

    // Add item to ticket
    const addItemToTicket = (ticketId: number, item: OrderItem) => {
      setTickets(t =>
        t.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                items: [...ticket.items, item],
              }
            : ticket
        )
      );
    };

    // Update quantity of an item
    const updateItemQuantity = (ticketId: number, itemId: string, quantity: number) => {
      setTickets(t =>
        t.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                items: ticket.items.map(item =>
                  item.id === itemId ? { ...item, quantity } : item
                ),
              }
            : ticket
        )
      );
    };

    // Remove an item
    const removeItemFromTicket = (ticketId: number, itemId: string) => {
      setTickets(t =>
        t.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                items: ticket.items.filter(item => item.id !== itemId),
              }
            : ticket
        )
      );
    };

    // Get a ticket by ID
    const getTicketById = (ticketId: number) => tickets.find(t => t.id === ticketId);

    return (
      <TicketContext.Provider
        value={{
          tickets,
          createTicket,
          addItemToTicket,
          updateItemQuantity,
          removeItemFromTicket,
          getTicketById,
          getReceiptForTicket,
        }}
      >
        {children}
      </TicketContext.Provider>
    );
  }

  // Custom hook
  export const useTickets = () => {
    const ctx = useContext(TicketContext);
    if (!ctx) throw new Error("useTickets must be used inside TicketProvider");
    return ctx;
  };
