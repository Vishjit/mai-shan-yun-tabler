"use client";

import React, { useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import Image from "next/image";
import { TableStatus } from "../lib/data";
import { useTickets } from "../context/ticketContext";

interface MarkerData {
  id: number;
  status: TableStatus;
  statusUpdatedAt?: number;
  markerNumber?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (type: "table" | "marker") => void;
  markers: MarkerData[];
  selectedMarker: number | null;
  setSelectedMarker: (id: number | null) => void;
  onUpdateOrder: (ticketId: number) => void;
  onChangeMarkerStatus?: (id: number, status: TableStatus) => void;
  onSaveLayout?: () => void;
  savedLayouts?: { id: number; name: string; thumbnail?: string }[];
  onLoadLayout?: (id: number) => void;
  onDuplicateLayout?: (id: number) => void;
  onDeleteLayout?: (id: number) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onAddItem,
  markers,
  selectedMarker,
  setSelectedMarker,
  onUpdateOrder,
  onChangeMarkerStatus,
  onSaveLayout,
  savedLayouts = [],
  onLoadLayout,
  onDuplicateLayout,
  onDeleteLayout,
}: SidebarProps) {
  // Small inner component to show elapsed time since order placed
  function OrderElapsed({ since }: { since?: number }) {
    const [display, setDisplay] = React.useState<string>("00:00");
    React.useEffect(() => {
      if (!since) return;
      const update = () => {
        const sec = Math.max(0, Math.floor((Date.now() - since) / 1000));
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        setDisplay(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
      };
      update();
      const id = window.setInterval(update, 1000);
      return () => clearInterval(id);
    }, [since]);

    if (!since) return null;
    return <div className="mt-2 text-sm text-gray-700">Time Since Order Placed: {display} minutes</div>;
  }
  const [activeTab, setActiveTab] = useState<"layout" | "orders">("layout");
  const { getReceiptForTicket } = useTickets();

  

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
          <div className="space-y-4">
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

            {/* Saved layouts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Saved layouts</div>
                <button
                  onClick={() => onSaveLayout && onSaveLayout()}
                  className="text-sm bg-[#AF3939] text-white px-3 py-1 rounded hover:bg-white hover:text-[#AF3939] hover:shadow-md hover:border hover:border-[#AF3939] transition-all duration-150"
                >
                  Save
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedLayouts && savedLayouts.length ? (
                  savedLayouts.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 bg-white p-2 rounded shadow">
                      <img src={s.thumbnail || "/table.svg"} alt={s.name} className="w-16 h-10 object-cover rounded" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{s.name}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onLoadLayout && onLoadLayout(s.id)} className="text-xs px-2 py-1 bg-[#F3F1EE] rounded">Load</button>
                        <button onClick={() => onDuplicateLayout && onDuplicateLayout(s.id)} className="text-xs px-2 py-1 bg-[#F3F1EE] rounded">Dup</button>
                        <button onClick={() => onDeleteLayout && onDeleteLayout(s.id)} className="text-xs px-2 py-1 bg-[#F3F1EE] rounded">Del</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-600">No saved layouts</div>
                )}
              </div>
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
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiFilePaper2Line className="w-5 h-5" />
                      <span className="font-bold">Marker {marker.markerNumber}</span>
                    </div>
                    <div>
                      <select
                        value={marker.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onChangeMarkerStatus && onChangeMarkerStatus(marker.id, e.target.value as TableStatus)}
                        className="text-sm text-gray-700 bg-white border px-3 py-1 rounded"
                        aria-label={`Marker ${marker.markerNumber} status`}
                      >
                        <option value="alert">Waiting for Service</option>
                        <option value="ordering">Waiting for Food</option>
                        <option value="available">Eating</option>
                      </select>
                    </div>
                  </div>
                  {/* Elapsed timer directly under header so it's always visible */}
                  {marker.status === "ordering" && marker.statusUpdatedAt && (
                    <div className="mt-2">
                      <OrderElapsed since={marker.statusUpdatedAt} />
                    </div>
                  )}

                  {/* Animated expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2 text-sm text-gray-700">
                      {(() => {
                        const receipt = getReceiptForTicket(marker.id);
                        if (receipt && receipt.lines.length > 0) {
                          return (
                            <>
                              {receipt.lines.map((line, index) => (
                                <div key={index}>• {line.name} ×{line.quantity} - ${line.lineTotal.toFixed(2)}</div>
                              ))}
                              <div className="font-semibold">Total: ${receipt.subtotal.toFixed(2)}</div>
                            </>
                          );
                        } else {
                          return <div>No items yet</div>;
                        }
                      })()}
                        <button
                          className="mt-2 w-full bg-[#AF3939] text-white py-1 rounded-lg hover:bg-white hover:text-[#AF3939] hover:shadow-md hover:border hover:border-[#AF3939] transform active:translate-y-0.5 transition-all duration-150"
                          onClick={() => onUpdateOrder(marker.id)}
                        >
                          Update Order
                        </button>
                        
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-[#AF3939] text-white py-2 rounded-lg hover:bg-white hover:text-[#AF3939] hover:shadow-md hover:border hover:border-[#AF3939] transition-all duration-150"
        >
          Close
        </button>
      </div>
    </aside>
  );
}
