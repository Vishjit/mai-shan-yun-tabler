import React, { useState } from "react";
import { TableStatus } from "../lib/data";


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
  onDoubleClick?: (id: number) => void;
  showControls?: boolean;
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
  onDoubleClick,
  showControls,
}: TableCardProps) {
  const [moveHover, setMoveHover] = useState(false);
  const [movePressed, setMovePressed] = useState(false);
  const [trashHover, setTrashHover] = useState(false);
  const [trashPressed, setTrashPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(id); }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onCardMouseDown?.(e, id);
      }}
      className={`
        relative w-40 h-40
        transition-all duration-200 ease-out
        ${isMoving ? "scale-105 z-50" : ""}
        cursor-grab active:cursor-grabbing
      `}
    >
      {/* Controls */}
      {isSelected && (showControls ?? true) && (
        <div className="absolute -top-4 -left-4 flex space-x-1 z-30">
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
              onMoveToggle?.(id);
            }}
          >
            <img
              src={
                movePressed || moveHover
                  ? "/move button hover.svg"
                  : "/move button.svg"
              }
              alt="move"
              className="w-7 h-7"
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
              onDelete?.(id);
            }}
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
              className="w-7 h-7"
            />
          </button>
        </div>
      )}

      {/* Table visual (no status color here) */}
      <div className="w-full h-full flex items-center justify-center">
        {type === "table" ? (
          <img
            src="/table.svg"
            alt={`Table ${id}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src="/marker.svg"
            alt={`Marker ${id}`}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
