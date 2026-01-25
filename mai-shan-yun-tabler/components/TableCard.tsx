import React from "react";
import { TableStatus } from "../lib/data";

interface TableCardProps {
  id: number;
  status: TableStatus;
  isSelected: boolean;
  onClick: () => void;
}

export default function TableCard({ id, status, isSelected, onClick }: TableCardProps) {
  const statusColor = {
    available: "bg-green-500",
    ordering: "bg-amber-400",
    alert: "bg-red-500",
  };

  return (
    <div
      className={`relative cursor-pointer w-48 h-48 flex-shrink-0`}
      onClick={onClick}
      style={{
        border: isSelected ? "4px solid #3B82F6" : "2px solid transparent",
      }}
    >
      {/* Status indicator */}
      <div
        className={`w-3 h-3 rounded-full ${statusColor[status]} absolute top-2 right-2`}
        aria-label={`Table ${id} status: ${status}`}
      />

      {/* Table SVG */}
      <img
        src="/table.svg"
        alt={`Table ${id}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
