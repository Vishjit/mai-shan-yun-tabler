  // src/context/TicketContext.tsx
  "use client";

  import { createContext, useContext, useState, useRef, ReactNode } from "react";

  // Type definitions
  export type OrderItem = {
    id: string;       // unique menu item ID
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  };

  export type Ticket = {
    id: number;       // unique ticket ID
    tableNumber: number;
    items: OrderItem[];
    lastUpdated?: number;
    // print control: when an update happens we set `printRequestedAt`; when kitchen prints we set `printedAt`
    printRequestedAt?: number;
    printedAt?: number;
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
    // requestPrint: when true, kitchen should re-print this ticket
    addItemToTicket: (ticketId: number, item: OrderItem, requestPrint?: boolean) => void;
    updateItemQuantity: (ticketId: number, itemId: string, quantity: number, requestPrint?: boolean) => void;
    removeItemFromTicket: (ticketId: number, itemId: string, requestPrint?: boolean) => void;
    getTicketById: (ticketId: number) => Ticket | undefined;
    getReceiptForTicket: (ticketId: number) => Receipt | undefined;
    markTicketPrinted: (ticketId: number) => void;
  };

  // Create context
  const TicketContext = createContext<TicketContextType | null>(null);

  // Provider component
  export function TicketProvider({ children }: { children: ReactNode }) {
    // Seed some base tickets so kitchen looks populated on load
    const now = Date.now();
    // Seed minimal tickets that correspond to the marker IDs created in `TableGrid`
    // TableGrid creates markers with ids 4,5,6 and markerNumber 1,2,3 on mount.
    const seededTickets: Ticket[] = [
      {
        id: 4,
        tableNumber: 1,
        items: [
          { id: "spb", name: "Steamed Pork Buns", price: 6, quantity: 1, notes: "None" },
        ],
        lastUpdated: now - 5000,
      },
      {
        id: 5,
        tableNumber: 2,
        items: [
          { id: "cuke", name: "Spicy Cucumber Salad", price: 8, quantity: 1, notes: "No tomatoes" },
        ],
        lastUpdated: now - 5000,
      },
      {
        id: 6,
        tableNumber: 3,
        items: [
          { id: "ramen", name: "House Ramen", price: 14, quantity: 2, notes: "No eggs" },
        ],
        lastUpdated: now - 5000,
      },
    ];

    const [tickets, setTickets] = useState<Ticket[]>(seededTickets);
    const ticketIdCounter = useRef(Math.max(...seededTickets.map(t => t.id)) + 1);
    const getReceiptForTicket = (ticketId: number): Receipt | undefined => {
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
      setTickets(t => [...t, { id: ticketId, tableNumber, items: [], lastUpdated: Date.now(), printRequestedAt: undefined }]);
      return ticketId;
    };

    // Add item to ticket
    const addItemToTicket = (ticketId: number, item: OrderItem, requestPrint: boolean = false) => {
      setTickets(t =>
        t.map(ticket => {
          if (ticket.id !== ticketId) return ticket;
          const existingIndex = ticket.items.findIndex(i => i.id === item.id);
          let newItems: OrderItem[];
          if (existingIndex >= 0) {
            newItems = ticket.items.map(i => (i.id === item.id ? { ...item } : i));
          } else {
            newItems = [...ticket.items, item];
          }
          return { ...ticket, items: newItems, lastUpdated: Date.now(), printRequestedAt: requestPrint ? Date.now() : ticket.printRequestedAt };
        })
      );
    };

    // Update quantity of an item
    const updateItemQuantity = (ticketId: number, itemId: string, quantity: number, requestPrint: boolean = false) => {
      setTickets(t =>
        t.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                items: ticket.items.map(item => (item.id === itemId ? { ...item, quantity } : item)),
                lastUpdated: Date.now(),
                printRequestedAt: requestPrint ? Date.now() : ticket.printRequestedAt,
              }
            : ticket
        )
      );
    };

    // Remove an item
    const removeItemFromTicket = (ticketId: number, itemId: string, requestPrint: boolean = false) => {
      setTickets(t =>
        t.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                items: ticket.items.filter(item => item.id !== itemId),
                lastUpdated: Date.now(),
                printRequestedAt: requestPrint ? Date.now() : ticket.printRequestedAt,
              }
            : ticket
        )
      );
    };

    const markTicketPrinted = (ticketId: number) => {
      setTickets(t => t.map(ticket => (ticket.id === ticketId ? { ...ticket, printedAt: Date.now(), printRequestedAt: undefined } : ticket)));
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
          markTicketPrinted,
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
