// import { useState } from "react";
// import { Table } from "../lib/data";

// interface OrderPanelProps {
//   table: Table;
// }

// export default function OrderPanel({ table }: OrderPanelProps) {

//     const [orders, setOrders] = useState<orderItem[]>(table.orders);
//   return (
//     <div className="bg-white rounded-xl p-4 shadow">
//       <h1 className="text-2xl font-bold">Table {table.id}</h1>

//       <h2 className="mt-4 font-semibold">Orders</h2>
//       {table.orders.length === 0 ? (
//         <p className="text-gray-400">No orders yet</p>
//       ) : (
//         table.orders.map((o) => (
//           <div key={o.itemId}>
//             {o.name} × {o.quantity}
//           </div>
//         ))
//       )}

//       <h2 className="mt-4 font-semibold">Allergies</h2>
//       {table.allergies.join(", ") || "None"}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Table, OrderItem } from "@/lib/data";
import { logEvent } from "@/lib/analyticsStore";
import { createEvent } from "@/lib/analyticsEvents";


interface OrderPanelProps {
  table: Table;

  // Optional callbacks for future integration
  onAddOrder?: (item: OrderItem) => void;
  onRemoveOrder?: (itemId: number) => void;
}

export default function OrderPanel({
  table,
  onAddOrder,
  onRemoveOrder,
}: OrderPanelProps) {
  // ---- STATE ----
  const [orders, setOrders] = useState<OrderItem[]>(table.orders);
  const [status, setStatus] = useState(table.status);

  // ---- LOGIC ----

  function addOrder(newItem: OrderItem) {
    setOrders((prev) => {
      const existing = prev.find((o) => o.itemId === newItem.itemId);

    logEvent(
        createEvent("order_added", {
            tableId: table.id,
            itemId: newItem.itemId,
            quantity: newItem.quantity,
            price: newItem.price, // add this field
        })
    );

      if (existing) {
        return prev.map((o) =>
          o.itemId === newItem.itemId
            ? { ...o, quantity: o.quantity + newItem.quantity }
            : o
        );
      }

      return [...prev, newItem];
    });

    // Table becomes ordering once something is added
    setStatus("ordering");

    onAddOrder?.(newItem);
  }

function removeOrder(itemId: number) {
    setOrders((prev) => prev.filter((o) => o.itemId !== itemId));

    logEvent(
        createEvent("order_removed", {
            tableId: table.id,
            itemId,
        })
    );

    onRemoveOrder?.(itemId);
}

function closeTable() {
  setOrders([]);
  setStatus("available");

  logEvent(
    createEvent("table_closed", {
      tableId: table.id,
    })
  );
}


  // ---- ALLERGY CHECK ----
  function hasAllergyConflict(itemAllergens: string[]) {
    return itemAllergens.some((a) => table.allergies.includes(a));
  }

  // ---- TEMP TEST HELPERS (SAFE TO DELETE LATER) ----
  function testAddItem() {
    addOrder({
      itemId: 1,
      name: "Test Dumplings",
      quantity: 1,
      price: 10,
    });
  }

  // ---- RENDER (minimal, UI-free) ----
  return (
    <div>
      <h1>Table {table.id}</h1>
      <p>Status: {status}</p>

      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((o) => (
          <div key={o.itemId}>
            {o.name} × {o.quantity}
            <button onClick={() => removeOrder(o.itemId)}>remove</button>
          </div>
        ))
      )}

      <h2>Allergies</h2>
      <p>{table.allergies.join(", ") || "None"}</p>

      {/* TEMP BUTTON — delete when UI is connected */}
      <button onClick={testAddItem}>Add test item</button>
    </div>
  );
}


