"use client";

import { Table } from "@/lib/data";
import { logEvent } from "@/lib/analyticsStore";
import { createEvent } from "@/lib/analyticsEvents";

interface OrderPanelProps {
  table: Table;
}

export default function OrderPanel({ table }: OrderPanelProps) {
  // ---- LOG STATUS CHANGES (display-only for now) ----
  function closeTable() {
    logEvent(
      createEvent("table_closed", {
        tableId: table.id,
      })
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md max-w-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Table {table.id}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
              table.status === "available"
                ? "bg-green-100 text-green-700"
                : table.status === "ordering"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {table.status}
        </span>
      </div>

      {/* ORDERS */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Orders</h2>

        {table.orders.length === 0 ? (
          <p className="text-gray-400">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {table.orders.map((o) => (
              <div
                key={o.itemId}
                className="flex justify-between items-center border-b pb-1"
              >
                <span>
                  {o.name} × {o.quantity}
                </span>
                <span className="text-gray-500">
                  ${((o.price ?? 0) * o.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ALLERGIES */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Allergies</h2>
        <p className="text-gray-600">
          {table.allergies.length > 0
            ? table.allergies.join(", ")
            : "None"}
        </p>
      </section>

      {/* ACTIONS (future-ready) */}
      <div className="flex gap-3">
        <button
          onClick={closeTable}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close Table
        </button>
      </div>
    </div>
  );
}
