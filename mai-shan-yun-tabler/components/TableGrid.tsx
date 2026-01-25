"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TableCard from "./TableCard";
import { TableStatus } from "../lib/data";
import Sidebar from "./sidebar";
import Menu from "./menubutton";
import Kitchen from "./kitchenbutton";
import Analytics from "./analyticsbutton";


export default function TableGrid() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const [tableData, setTableData] = useState<{ id: number; status: TableStatus; x: number; y: number }[]>([
    { id: 1, status: "available", x: 120, y: 80 },
    { id: 2, status: "ordering", x: 360, y: 80 },
    { id: 3, status: "alert", x: 120, y: 320 },
  ]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const movingIdRef = useRef<number | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);

  const handleTableClick = (id: number) => {
    setSelectedTable(id);
    setSidebarOpen(true);
  };

  const handleMoveToggle = (id: number) => {
    setMovingId((prev) => (prev === id ? null : id));
  };

  const handleCardMouseDown = (e: React.MouseEvent, id: number) => {
    // if move mode is active for this id, start dragging
    if (movingId !== id) return;
    e.preventDefault();
    movingIdRef.current = id;

    const onMouseMove = (ev: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cardHalf = 96; // half of 192px (w-48)
      const x = ev.clientX - rect.left - cardHalf;
      const y = ev.clientY - rect.top - cardHalf;
      setTableData((prev) => prev.map((t) => (t.id === id ? { ...t, x: Math.max(0, x), y: Math.max(0, y) } : t)));
    };

    const onMouseUp = () => {
      movingIdRef.current = null;
      setMovingId(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top buttons / nav */}
      <div className="flex space-x-4 p-8 mb-12 items-center">
        <div onClick={() => router.push("/menu")} className="cursor-pointer width-[100%]">
          <Menu />
        </div>

        <div onClick={() => router.push("/kitchen")} className="cursor-pointer">
          <Kitchen />
        </div>

        <div onClick={() => router.push("/analytics")} className="cursor-pointer">
          <Analytics />
        </div>
      </div>

      {/* Main content + sidebar container */}
      <div className="flex flex-1 transition-all duration-300">
        {/* Table grid */}
        <div
          ref={containerRef}
          onMouseDown={() => setMovingId(null)}
          className={`relative flex-1 p-8 transition-all duration-300`}
          style={{ marginRight: sidebarOpen ? "30%" : "0" }}
        >
          {tableData.map((table) => (
            <div
              key={table.id}
              style={{ position: "absolute", left: table.x, top: table.y }}
            >
              <TableCard
                id={table.id}
                status={table.status}
                isSelected={selectedTable === table.id}
                isMoving={movingId === table.id}
                onClick={() => handleTableClick(table.id)}
                onMoveToggle={handleMoveToggle}
                onCardMouseDown={handleCardMouseDown}
                onDelete={(id) => setTableData((prev) => prev.filter((t) => t.id !== id))}
              />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
  
}
