"use client";
import { useRouter } from "next/navigation";
import Ticket from "../../components/ticket";
import Menu from "../../components/menubutton";
import Kitchenbutton from "@/components/kitchenbutton";
import Analytics from "@/components/analyticsbutton";
import TableButton from "@/components/tablesbutton";
import MenuButton from "../../components/menubutton";
import { useTickets } from "@/context/ticketContext";
import { useEffect, useState } from "react";


export default function Kitchen() {
  const router = useRouter();
  const { tickets, markTicketPrinted } = useTickets();

  const [printingIds, setPrintingIds] = useState<number[]>([]);

  // When a ticket has a `printRequestedAt` newer than `printedAt`, schedule a print
  useEffect(() => {
    const toPrint = tickets.filter(t => t.printRequestedAt && (t.printedAt ?? 0) < (t.printRequestedAt ?? 0));
    if (toPrint.length === 0) return;

    const timers: number[] = [];
    toPrint.forEach((t, idx) => {
      // stagger slightly so multiple prints are visible
      const delay = idx * 200;
      const timer = window.setTimeout(() => {
        setPrintingIds(prev => [...prev, t.id]);
        // after animation, mark as printed
        const clearTimer = window.setTimeout(() => {
          markTicketPrinted(t.id);
          setPrintingIds(prev => prev.filter(id => id !== t.id));
        }, 1000 + 200); // animation length + small buffer
        timers.push(clearTimer);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(id => clearTimeout(id));
  }, [tickets]);

  const printingTicket = tickets.find(t => printingIds.includes(t.id)) ?? tickets[0];
  const sideTickets = tickets.filter(t => t.id !== printingTicket?.id).slice(0, 3);

  return (
    <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
      {/* Top buttons / nav */}
      <div className="flex space-x-3 p-4 mb-6 items-center">
        <div onClick={() => router.push("/menu")} className="cursor-pointer">
          <MenuButton />
        </div>
        <div onClick={() => router.push("/tables")} className="cursor-pointer">
          <TableButton />
        </div>
        <div onClick={() => router.push("/analytics")} className="cursor-pointer">
          <Analytics />
        </div>
      </div>

      <div style={{ position: "absolute", top: 0, right: 120, display: "flex", gap: 120, zIndex: 20 }}>
        {sideTickets.map(t => (
          <div key={t.id} style={{ width: 110 }}>
            <Ticket
              tableNumber={t.tableNumber}
              orderNo={t.id}
              items={t.items.map(i => ({ name: i.name, quantity: i.quantity, notes: i.notes }))}
              printing={printingIds.includes(t.id)}
            />
          </div>
        ))}
      </div>

      <div className="absolute left-[-18] top-[38%] w-full  flex z-20 pointer-events-none">
        <img src="/pots.svg" alt="pots" className="w-[30%] h-auto z-20" />
      </div>
      <div className="absolute left-[75%] top-[50%] w-full  flex z-20 pointer-events-none">
        <img src="/vegetables.svg" alt="vegetables" className="w-[30%] h-auto z-20" />
      </div>

      <div className="absolute top-[50%] w-full  justify-center flex z-20 pointer-events-none">
        <img src="/bottomprinter.png" alt="printer" className="w-[25%] h-auto z-0" />
      </div>

      {printingTicket && (
        <div className="absolute top-[50%] w-full  justify-center flex z-20 pointer-events-none">
          <Ticket
            tableNumber={printingTicket.tableNumber}
            orderNo={printingTicket.id}
            items={printingTicket.items.map(i => ({ name: i.name, quantity: i.quantity, notes: i.notes }))}
            printing={printingIds.includes(printingTicket.id)}
          />
        </div>
      )}

      <div className="absolute top-[35%] w-full  justify-center flex z-20 pointer-events-none">
        <img src="/topprinter.svg" alt="printer" className="w-[25%] h-auto z-20" />
      </div>

      <div className="absolute bottom-0 w-full h-[30%] bg-[#AF3939] z-10" />
    </div>
  );
}
