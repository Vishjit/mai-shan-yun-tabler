import React from "react";
import { TableStatus } from "../lib/data";
import { RiFilePaper2Line } from "react-icons/ri";

interface MarkerProps {
  id: number;
  markerNumber: number;
  status: TableStatus;
  isSelected: boolean;
  isMoving?: boolean;
  onClick: () => void;
  onMoveToggle?: (id: number) => void;
  onCardMouseDown?: (e: React.MouseEvent, id: number) => void;
  onDelete?: (id: number) => void;
}

export default function Marker({
  id,
  markerNumber,
  status,
  isSelected,
  isMoving,
  onClick,
  onMoveToggle,
  onCardMouseDown,
  onDelete,
}: MarkerProps) {
  const statusColor = {
    available: "bg-green-500",
    ordering: "bg-amber-400",
    alert: "bg-red-500",
  };

  return (
    <div
      className={`relative cursor-pointer w-48 h-48 flex-shrink-0 flex items-center justify-center`}
      onClick={onClick}
      onMouseDown={(e) => { e.stopPropagation(); onCardMouseDown && onCardMouseDown(e, id); }}
      style={{
        border: isMoving ? "6px solid #AF3939" : isSelected ? "4px solid #3B82F6" : "2px solid transparent",
        boxSizing: "border-box",
      }}
    >
      {/* Status indicator */}
      <div
        className={`w-3 h-3 rounded-full ${statusColor[status]} absolute top-2 right-2`}
        aria-label={`Marker ${markerNumber} status: ${status}`}
      />

      {/* Marker icon */}
      <RiFilePaper2Line className="w-12 h-12 text-gray-700" />

      {/* Marker number */}
      <div className="absolute -bottom-3 text-sm font-bold text-gray-800">
        #{markerNumber}
      </div>

      {/* Optional move/delete controls */}
      {isSelected && (
        <div className="absolute -top-5 -left-4 flex space-x-1 z-30">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveToggle && onMoveToggle(id); }}
            title="Move marker"
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <img src="/move button.svg" alt="move" className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(id); }}
            title="Delete marker"
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <img src="/trash button.svg" alt="delete" className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
