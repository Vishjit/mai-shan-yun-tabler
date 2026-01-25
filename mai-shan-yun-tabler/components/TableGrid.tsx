"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TableCard from "./TableCard";
import Marker from "./marker";
import { TableStatus } from "../lib/data";
import Sidebar from "./sidebar";
import Menu from "./menubutton";
import Kitchen from "./kitchenbutton";
import Analytics from "./analyticsbutton";

export default function TableGrid() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

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
    const newId = tableData.length ? Math.max(...tableData.map((t) => t.id)) + 1 : 1;

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
        />
      </div>
    </div>
  );
}
