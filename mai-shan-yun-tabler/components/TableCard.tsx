import React, { useState } from "react";
import { TableStatus } from "../lib/data";
import { RiFilePaper2Line } from "react-icons/ri";

interface TableCardProps {
  id: number;
  status: TableStatus;
  type: "table" | "marker";
  isSelected: boolean;
  isMoving?: boolean;
  onClick: () => void;
  onMoveToggle?: (id: number) => void;
  onCardMouseDown?: (e: React.MouseEvent, id: number) => void;
  onDelete?: (id: number) => void;
}

export default function TableCard({
  id,
  status,
  type,
  isSelected,
  isMoving,
  onClick,
  onMoveToggle,
  onCardMouseDown,
  onDelete,
}: TableCardProps) {
  const [moveHover, setMoveHover] = useState(false);
  const [movePressed, setMovePressed] = useState(false);
  const [trashHover, setTrashHover] = useState(false);
  const [trashPressed, setTrashPressed] = useState(false);

  const statusColor = {
    available: "bg-green-500",
    ordering: "bg-amber-400",
    alert: "bg-red-500",
  };

  return (
    <div
      className={`relative cursor-pointer w-48 h-48 flex-shrink-0 bg-transparent`}
      onClick={onClick}
      onMouseDown={(e) => {
        e.stopPropagation();
        onCardMouseDown && onCardMouseDown(e, id);
      }}
      style={{
        border: isMoving ? "6px solid #AF3939" : "2px solid transparent",
        boxSizing: "border-box",
      }}
    >
      {/* Controls move + delete shown when selected */}
      {isSelected && (
        <div className="absolute -top-5 -left-4 flex space-x-1 z-30">
          <button
            onMouseEnter={() => setMoveHover(true)}
            onMouseLeave={() => {
              setMoveHover(false);
              setMovePressed(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setMovePressed(true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              setMovePressed(false);
              onMoveToggle && onMoveToggle(id);
            }}
            title="Move layout"
            className={`w-8 h-8 rounded-full flex items-center justify-center`}
          >
            <img
              src={
                movePressed
                  ? "/move button hover.svg"
                  : moveHover
                  ? "/move button hover.svg"
                  : "/move button.svg"
              }
              alt="move"
              className="w-8 h-8"
            />
          </button>

          <button
            onMouseEnter={() => setTrashHover(true)}
            onMouseLeave={() => {
              setTrashHover(false);
              setTrashPressed(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setTrashPressed(true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              setTrashPressed(false);
              onDelete && onDelete(id);
            }}
            title="Delete layout"
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <img
              src={
                trashPressed
                  ? "/trash button hover.svg"
                  : trashHover
                  ? "/trash button delete.svg"
                  : "/trash button.svg"
              }
              alt="delete"
              className="w-8 h-8 "
            />
          </button>
        </div>
      )}

      {/* Status indicator */}
      <div
        className={`w-3 h-3 rounded-full ${statusColor[status]} absolute top-2 right-2`}
        aria-label={`Table ${id} status: ${status}`}
      />

      {/* Table or Marker */}
      <div className="w-full h-full flex items-center justify-center">
        {type === "table" ? (
          <img src="/table.svg" alt={`Table ${id}`} className="w-full h-full object-contain" />
        ) : (
          <RiFilePaper2Line className="w-16 h-16 text-[#57321F]" />
        )}
      </div>
    </div>
  );
}
