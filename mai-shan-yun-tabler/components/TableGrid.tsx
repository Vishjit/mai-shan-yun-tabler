"use client";

import React, { useState } from "react";
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

  const tableData: { id: number; status: TableStatus }[] = [
    { id: 1, status: "available" },
    { id: 2, status: "ordering" },
    { id: 3, status: "alert" },
  ];

  const handleTableClick = (id: number) => {
    setSelectedTable(id);
    setSidebarOpen(true);
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
          className={`flex justify-center items-start gap-12 flex-wrap p-8 flex-1 transition-all duration-300`}
          style={{ marginRight: sidebarOpen ? "30%" : "0" }}
        >
          {tableData.map((table) => (
            <TableCard
              key={table.id}
              id={table.id}
              status={table.status}
              isSelected={selectedTable === table.id}
              onClick={() => handleTableClick(table.id)}
            />
          ))}
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
  
}
