"use client";

import React, { useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import Image from 'next/image';
import { TableStatus } from "../lib/data";

interface MarkerData {
  id: number;
  status: TableStatus;
  markerNumber?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (type: "table" | "marker") => void;

  // NEW
  markers: MarkerData[];
  selectedMarker: number | null;
  setSelectedMarker: (id: number | null) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onAddItem,
  markers,
  selectedMarker,
  setSelectedMarker,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"layout" | "orders">("layout");

  const statusLabel: Record<TableStatus, string> = {
    available: "Empty",
    ordering: "Eating",
    alert: "Waiting for Bill",
  };

  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 h-full bg-[#F0E7DF] shadow-xl w-[320px]
      transition-transform duration-300 flex flex-col border-l-8 border-[#57321F]
      ${isOpen ? "translate-x-0" : "translate-x-full"} z-40`}
    >
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">

        {/* Tabs */}
        <div className="mb-6">
          <div className="relative bg-white rounded-full p-0.5">
            <div
              className="absolute top-0 left-0 h-full w-1/2 bg-[#AF3939] rounded-full transition-transform"
              style={{
                transform:
                  activeTab === "layout"
                    ? "translateX(0%)"
                    : "translateX(100%)",
              }}
            />
            <div className="relative z-10 grid grid-cols-2">
              <button
                onClick={() => setActiveTab("layout")}
                className={`py-2 text-sm font-['Jost'] ${
                  activeTab === "layout" ? "text-white" : "text-gray-700"
                }`}
              >
                Layout
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 text-sm font-['Jost'] ${
                  activeTab === "orders" ? "text-white" : "text-gray-700"
                }`}
              >
                Orders
              </button>
            </div>
          </div>
        </div>

        {/* ================= LAYOUT TAB ================= */}
        {activeTab === "layout" && (
          <div className="grid grid-cols-2 gap-4">
            <div
              className="cursor-pointer"
              onClick={() => onAddItem("table")}
            >
              <div className="bg-white rounded-xl p-4 flex justify-center">
                <Image src="/table.svg" alt="table" width={64} height={64} />
              </div>
              <div className="text-center mt-2">Table</div>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => onAddItem("marker")}
            >
              <div className="bg-white rounded-xl p-4 flex justify-center">
                <RiFilePaper2Line className="w-8 h-8 text-[#57321F]" />
              </div>
              <div className="text-center mt-2">Marker</div>
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {markers.map((marker) => {
              const isOpen = selectedMarker === marker.id;

              return (
                <div
                  key={marker.id}
                  onClick={() =>
                    setSelectedMarker(isOpen ? null : marker.id)
                  }
                  className={`cursor-pointer rounded-xl transition-all
                    ${isOpen ? "bg-white p-4 shadow" : "bg-[#FFFDFB] p-3"}
                  `}
                >
                  {/* Header (always visible) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiFilePaper2Line className="w-5 h-5" />
                      <span className="font-bold">
                        Marker {marker.markerNumber}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {statusLabel[marker.status]}
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div>• Spicy Cucumber Salad ×1</div>
                      <div>• Fried Rice ×2</div>
                      <button className="mt-2 w-full bg-[#AF3939] text-white py-1 rounded-lg">
                        Update Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-[#AF3939] text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </aside>
  );
}
