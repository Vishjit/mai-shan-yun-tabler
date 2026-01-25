"use client";

import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`h-full bg-white shadow-xl w-[30%] max-w-md transition-transform duration-300 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-2xl font-bold mb-4">Table Details</h2>
        <p>Put table order info here...</p>
        <button
          className="mt-auto px-4 py-2 bg-rose-700 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
