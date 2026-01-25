"use client";

import React, { useEffect, useRef } from "react";

interface TicketProps {
  tableNumber: number;
  orderNo: number | string;
  items?: { name: string; quantity?: number; notes?: string }[];
  printing?: boolean; // triggers the print animation
  className?: string;
}

export default function Ticket({ tableNumber, orderNo, items = [], printing = false, className = "" }: TicketProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!printing) return;
    el.classList.remove("print-animate");
    el.offsetWidth;
    el.classList.add("print-animate");
    const handle = setTimeout(() => el.classList.remove("print-animate"), 1500);
    return () => clearTimeout(handle);
  }, [printing]);

  return (
    <div ref={containerRef} className={`relative ${className} pointer-events-none`}>
      <style>{`\n        .print-animate { animation: ticketPrint 900ms ease-out forwards; }\n        @keyframes ticketPrint {\n          0% { transform: translateY(-140%) scale(0.98); opacity: 0 }\n          60% { transform: translateY(8%) scale(1.02); opacity: 1 }\n          100% { transform: translateY(0) scale(1); opacity: 1 }\n        }\n      `}</style>

      {/* Receipt base */}
      <div className="relative w-60">
        <img src="/reciept.svg" alt="receipt" className="w-full h-auto block" />

        {/* Receipt content */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[8%] w-[85%] text-xs text-[#3D3D3D]">
          <div className="flex justify-between items-start">
            <div className="font-bold text-[20px]">Table {tableNumber}</div>
            <div className="text-[13px]">Order No. {orderNo}</div>
          </div>

          <div className="mt-2 space-y-1">
            {items.length === 0 ? (
              <div className="text-[#3D3D3D] text-[11px]">No items</div>
            ) : (
              items.map((it, idx) => (
                <div key={idx} className="text-[15px]">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-[#3D3D3D] text-[13px]">quantity: {it.quantity ?? 1}</div>
                  {it.notes && <div className="text-[#3D3D3D] text-[13px]">Notes: {it.notes}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
