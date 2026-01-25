// src/context/TicketContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Type definitions
export type OrderItem = {
  id: string;       // unique menu item ID
  name: string;
  price: number;
  quantity: number;
};

export type Ticket = {
  id: string;       // unique ticket ID
  tableNumber: number;
  items: OrderItem[];
};

// Context type
type TicketContextType = {
  tickets: Ticket[];
  createTicket: (tableNumber: number) => string;
  addItemToTicket: (ticketId: string, item: OrderItem) => void;
  updateItemQuantity: (ticketId: string, itemId: string, quantity: number) => void;
  removeItemFromTicket: (ticketId: string, itemId: string) => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
};

// Create context
const TicketContext = createContext<TicketContextType | null>(null);

// Provider component
export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Create new ticket
  const createTicket = (tableNumber: number) => {
    const id = crypto.randomUUID();
    setTickets(t => [...t, { id, tableNumber, items: [] }]);
    return id;
  };

  // Add item to ticket
  const addItemToTicket = (ticketId: string, item: OrderItem) => {
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
  const updateItemQuantity = (ticketId: string, itemId: string, quantity: number) => {
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
  const removeItemFromTicket = (ticketId: string, itemId: string) => {
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
  const getTicketById = (ticketId: string) => tickets.find(t => t.id === ticketId);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        createTicket,
        addItemToTicket,
        updateItemQuantity,
        removeItemFromTicket,
        getTicketById,
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
