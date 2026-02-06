import React from "react";
import {
  RiFilePaper2Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { TableStatus } from "../lib/data";

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
  onDoubleClick?: () => void;

  // NEW: functions to handle status changes
  onStatusForward?: (id: number) => void;
  onStatusBackward?: (id: number) => void;
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
  onStatusForward,
  onStatusBackward,
  onDoubleClick,
}: MarkerProps) {
  const statusBg: Record<TableStatus, string> = {
    available: "bg-green-300",
    ordering: "bg-amber-300",
    alert: "bg-red-300",
  };

  return (
    <div
      onClick={onClick}
      onDoubleClick={() => onDoubleClick?.()}
      onMouseDown={(e) => {
        e.stopPropagation();
        onCardMouseDown?.(e, id);
      }}
      className={`
        relative w-24 h-24 flex items-center justify-center
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-[cubic-bezier(.22,1,.36,1)]
        ${isMoving ? "scale-110 z-50" : ""}
      `}
    >
      {/* Marker bubble */}
      <div
        className={`
          ${statusBg[status]}
          w-14 h-14 rounded-full
          flex items-center justify-center
          transition-transform duration-200
          ${isSelected ? "scale-110 shadow-md" : ""}
        `}
      >
        <RiFilePaper2Line className="w-7 h-7 text-[#57321F]" />
      </div>
            
      {/* Marker number */}
      <div className="absolute -bottom-3 text-xs font-semibold text-gray-700">
        #{markerNumber}
      </div>

      {/* Status arrows (centered vertically) */}
      {isSelected && (
        <>
          {/* Backward arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusBackward?.(id);
            }}
            title="Previous status"
            className="
              absolute left-[-10px] top-1/2 transform -translate-y-1/2
              text-[#57321F]/50 hover:text-[#57321F]
              hover:scale-110 transition
            "
          >
            <RiArrowLeftSLine className="w-4 h-4" />
          </button>

          {/* Forward arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusForward?.(id);
            }}
            title="Next status"
            className="
              absolute right-[-10px] top-1/2 transform -translate-y-1/2
              text-[#57321F]/50 hover:text-[#57321F]
              hover:scale-110 transition 
            "
          >
            <RiArrowRightSLine className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Move / Delete controls */}
      {isSelected && (
        <div className="absolute -top-4 -left-4 flex space-x-1 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveToggle?.(id);
            }}
          >
            <img src="/move button.svg" alt="move" className="w-7 h-7" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
          >
            <img src="/trash button.svg" alt="delete" className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
}
