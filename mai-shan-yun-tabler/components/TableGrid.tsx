"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TableCard from "./TableCard";
import Marker from "./marker";
import { TableStatus } from "../lib/data";
import Sidebar from "./sidebar";
import Menu from "./menubutton";
import Kitchen from "./kitchenbutton";
import Analytics from "./analyticsbutton";
import { useTickets } from "../context/ticketContext";
import { menuItems } from "../lib/menu";
import MenuItem from "./MenuItem";
import Image from "next/image";

interface MenuItemType {
  id: number;
  name: string;
  price: number;
  ingredients: string;
}

function MenuOverlay({ ticketId, onClose }: { ticketId: number; onClose: () => void }) {
  const { addItemToTicket, removeItemFromTicket, getTicketById } = useTickets();

  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const ticket = getTicketById(ticketId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full h-full bg-[#FFFDFB] overflow-hidden">
        
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#AF3939] text-white flex items-center justify-center text-xl font-bold z-50"
        >
          ←
        </button>

        {/* Title */}
        <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
          Menu
        </div>

        {/* Clouds */}
        <Image
          src="/cloud (1).svg"
          alt="cloud"
          width={100}
          height={100}
          className="absolute z-10 left-[30%] top-[5%] w-[7%] h-auto object-contain anim-cloud"
        />
        <Image
          src="/cloud (2).svg"
          alt="cloud"
          width={160}
          height={100}
          className="absolute z-10 right-[3%] top-[10%] w-[160px] h-auto object-contain anim-cloud-long"
        />

        {/* MENU ITEMS */}
        <div className="grid grid-cols-4 gap-6 mt-56 px-16">
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              name={item.name}
              price={item.price}
              ingredients={item.ingredients}
              onClick={() => {
                setSelectedItem(item);
                const existingItem = ticket?.items.find(i => i.id === item.id.toString());
                setQuantity(existingItem ? existingItem.quantity : 1);
              }}
            />
          ))}
        </div>

        {selectedItem && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-4 flex items-center gap-6 z-50">
            <span className="font-semibold text-lg">{selectedItem.name}</span>

            <div className="flex items-center gap-3">
              <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              >
                −
              </button>

              <span className="w-6 text-center text-lg">{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-full bg-gray-200 text-xl font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                if (selectedItem) {
                  if (quantity > 0) {
                    addItemToTicket(ticketId, { id: selectedItem.id.toString(), name: selectedItem.name, price: selectedItem.price, quantity });
                  } else {
                    removeItemFromTicket(ticketId, selectedItem.id.toString());
                  }
                  setSelectedItem(null);
                  setQuantity(1);
                }
              }}
              className="bg-[#AF3939] text-white px-4 py-2 rounded-lg"
            >
              {quantity > 0 ? 'Update Order' : 'Remove Item'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TableGrid() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuTicketId, setMenuTicketId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const router = useRouter();
  const { createTicket } = useTickets();

  // Table/marker data
  const [tableData, setTableData] = useState<
    {
      id: number;
      status: TableStatus;
      type: "table" | "marker";
      x: number;
      y: number;
      markerNumber?: number;
    }[]
  >([
    { id: 1, status: "available", type: "table", x: 120, y: 80 },
    { id: 2, status: "ordering", type: "table", x: 360, y: 80 },
    { id: 3, status: "alert", type: "table", x: 120, y: 320 },
    // Each table comes with one marker — start them RED
    { id: 4, status: "alert", type: "marker", markerNumber: 1, x: 160, y: 120 },
    { id: 5, status: "alert", type: "marker", markerNumber: 2, x: 400, y: 120 },
    { id: 6, status: "alert", type: "marker", markerNumber: 3, x: 160, y: 360 },
  ]);

  // Create tickets for existing markers on mount
  useEffect(() => {
    tableData.filter(item => item.type === "marker").forEach(marker => {
      createTicket(marker.markerNumber || 0, marker.id);
    });
  }, [createTicket, tableData]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const movingIdRef = useRef<number | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);

  // Clicking a table/marker
  const handleTableClick = (id: number) => {
    setSelectedTable(id);
    setSidebarOpen(true);
  };

  // Toggle move mode
  const handleMoveToggle = (id: number) => {
    setMovingId((prev) => (prev === id ? null : id));
  };

  // Dragging logic
  const handleCardMouseDown = (e: React.MouseEvent, id: number) => {
    if (movingId !== id) return;
    e.preventDefault();
    movingIdRef.current = id;

    const onMouseMove = (ev: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cardHalf = 96; // Half of w-48 (192px)
      const x = ev.clientX - rect.left - cardHalf;
      const y = ev.clientY - rect.top - cardHalf;
      setTableData((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, x: Math.max(0, x), y: Math.max(0, y) } : t
        )
      );
    };

    const onMouseUp = () => {
      movingIdRef.current = null;
      setMovingId(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      const snap = (v: number) => Math.round(v / 16) * 16;
      setTableData((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, x: snap(t.x), y: snap(t.y) } : t
        )
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Add a new item (table or marker)
  const handleAddItem = (type: "table" | "marker") => {
    let newId;
    if (type === "marker") {
      // For markers, create a ticket first and use its id
      newId = createTicket(0); // tableNumber 0 for now, or perhaps assign based on something
    } else {
      newId = tableData.length ? Math.max(...tableData.map((t) => t.id)) + 1 : 1;
    }

    let newItem;
    if (type === "marker") {
      const nextMarkerNumber =
        Math.max(
          0,
          ...tableData.filter((t) => t.type === "marker").map((m) => m.markerNumber || 0)
        ) + 1;

      newItem = {
        id: newId,
        status: "alert" as TableStatus, // start new markers RED
        type: "marker" as const,
        markerNumber: nextMarkerNumber,
        x: 200,
        y: 200,
      };
    } else {
      newItem = {
        id: newId,
        status: "available" as TableStatus,
        type: "table" as const,
        x: 200,
        y: 200,
      };
    }

    setTableData((prev) => [...prev, newItem]);
    setSelectedTable(newId);
    setSidebarOpen(true);
  };

  // Status sequence
  const statusSequence: TableStatus[] = ["alert", "ordering", "available"]; // RED → YELLOW → GREEN

  // Forward status: RED -> YELLOW -> GREEN
  const handleMarkerForward = (id: number) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.type !== "marker") return item;
        const currentIndex = statusSequence.indexOf(item.status);
        const nextIndex = (currentIndex + 1) % statusSequence.length;
        return { ...item, status: statusSequence[nextIndex] };
      })
    );
  };

  // Backward status: GREEN -> YELLOW -> RED
  const handleMarkerBackward = (id: number) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.type !== "marker") return item;
        const currentIndex = statusSequence.indexOf(item.status);
        const prevIndex = (currentIndex - 1 + statusSequence.length) % statusSequence.length;
        return { ...item, status: statusSequence[prevIndex] };
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top buttons / nav */}
      <div className="flex space-x-4 p-8 mb-12 items-center">
        <div onClick={() => router.push("/menu")} className="cursor-pointer">
          <Menu />
        </div>
        <div onClick={() => router.push("/kitchen")} className="cursor-pointer">
          <Kitchen />
        </div>
        <div onClick={() => router.push("/analytics")} className="cursor-pointer">
          <Analytics />
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="flex flex-1 transition-all duration-300">
        {/* Table grid */}
        <div
          ref={containerRef}
          onMouseDown={() => setMovingId(null)}
          className="relative flex-1 p-8 transition-all duration-300"
          style={{ marginRight: sidebarOpen ? "30%" : "0" }}
        >
          {tableData.map((item) => (
            <div
              key={item.id}
              className="absolute transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${item.x}px, ${item.y}px)`,
              }}
            >
              {item.type === "table" ? (
                <TableCard
                  id={item.id}
                  status={item.status}
                  type="table"
                  isSelected={selectedTable === item.id}
                  isMoving={movingId === item.id}
                  onClick={() => handleTableClick(item.id)}
                  onMoveToggle={handleMoveToggle}
                  onCardMouseDown={handleCardMouseDown}
                  onDelete={(id) =>
                    setTableData((prev) => prev.filter((t) => t.id !== id))
                  }
                />
              ) : (
                <Marker
                  id={item.id}
                  markerNumber={item.markerNumber!}
                  status={item.status}
                  isSelected={selectedTable === item.id}
                  isMoving={movingId === item.id}
                  onClick={() => handleTableClick(item.id)}
                  onMoveToggle={handleMoveToggle}
                  onCardMouseDown={handleCardMouseDown}
                  onDelete={(id) =>
                    setTableData((prev) => prev.filter((t) => t.id !== id))
                  }
                  onStatusForward={handleMarkerForward}
                  onStatusBackward={handleMarkerBackward}
                />
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddItem={handleAddItem}
          markers={tableData.filter((t) => t.type === "marker")}
          selectedMarker={selectedTable}
          setSelectedMarker={setSelectedTable}
          onUpdateOrder={(ticketId) => {
            setMenuTicketId(ticketId);
            setShowMenu(true);
            setMenuVisible(true);
          }}
        />
      </div>

      {/* Menu Overlay */}
      {menuVisible && menuTicketId && (
        <div className="fixed right-0 top-0 bottom-0 w-80 z-50">
          <div className={`relative w-full h-full bg-[#FFFDFB] overflow-hidden transition-all duration-500 ease-out ${showMenu ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <MenuOverlay ticketId={menuTicketId} onClose={() => { setShowMenu(false); setTimeout(() => setMenuVisible(false), 500); }} />
          </div>
        </div>
      )}
    </div>
  );
}
