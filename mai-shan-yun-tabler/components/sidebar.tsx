"use client";

import React, { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"layout" | "orders">("layout");
  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 h-full bg-[#F0E7DF] shadow-xl w-[320px] transition-transform duration-300 flex flex-col border-l-8 border-[#57321F] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-40`}
    >
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">
        {/* Tabs sliding */}
        <div className="mb-6">
          <div className="relative w-full max-w-[320px]">
            <div className="relative bg-white rounded-full p-0.5">
              {/* sliding indicator */}
              <div
                  aria-hidden
                  className={`absolute top-0 left-0 h-full w-1/2 bg-[#AF3939] rounded-full transition-transform duration-300`}
                  style={{ transform: `translateX(${activeTab === "layout" ? 0 : 100}%)` }}
                ></div>

              {/* Buttons */}
              <div className="relative z-10 grid grid-cols-2">
                <button
                  onClick={() => setActiveTab("layout")}
                  className={`px-4 py-2 rounded-full text-sm font-['Jost'] font-normal transition-colors duration-200 ${
                    activeTab === "layout" ? "text-white" : "text-gray-700"
                  }`}
                  aria-pressed={activeTab === "layout"}
                >
                  Table Layout
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-full text-sm font-['Jost'] font-medium transition-colors duration-200 ${
                    activeTab === "orders" ? "text-white" : "text-gray-700"
                  }`}
                  aria-pressed={activeTab === "orders"}
                >
                  Table Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved layouts */}
        <h3 className="text-xl font-bold mb-3 font-['Jost']">Saved Layouts:</h3>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center">
            <img src="/layout1.png" alt="layout 1" className="w-full h-auto object-contain" />
          </div>
          <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center">
            <img src="/layout2.png" alt="layout 2" className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-sm text-gray-700">layout 1</div>
          <div className="text-sm text-gray-700">layout 2</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#ffffff] rounded-full h-3 mb-3">
          <div className="bg-[#AF3939] h-3 rounded-full" style={{ width: '18%' }} />
        </div>

        <p className="text-sm text-[#696159] mb-6">Double click item to add to restaurant floor.</p>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tile componentssss*/}
          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/table panel.svg" alt="table" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Table</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/right chair.svg" alt="right chair" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Right Chair</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/left chair.svg" alt="left chair" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Left Chair</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/top chair.svg" alt="top chair" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Top Chair</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/bottom chair.svg" alt="bottom chair" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Bottom Chair</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/top couch.svg" alt="top couch" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Top Couch</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="bg-[#FFFDFB] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/bottom couch.svg" alt="bottom couch" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Bottom Couch</div>
          </div>

          {/* Save layout tile */}
          <div className="flex flex-col items-start">
            <div className="bg-[#AF3939] rounded-2xl p-3 flex items-center justify-center w-28 h-28">
              <img src="/save layout.svg" alt="save layout" className="w-full h-full object-contain" />
            </div>
            <div className="mt-2 text-center w-28">Save Layout</div>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-[#AF3939] text-white rounded font-['Jost']"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </aside>
  );
}
