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

  const borderColor = isSelected ? "border-blue-500" : "border-gray-300";

  return (
    <div
      className={`relative rounded-xl bg-white p-4 shadow border-2 ${borderColor} cursor-pointer`}
      onClick={onClick}
    >
      <span
        className={`absolute top-2 right-2 h-3 w-3 rounded-full ${statusColor[status]}`}
      />
      <h2 className="text-lg font-bold">Table {id}</h2>
    </div>
  );
}
