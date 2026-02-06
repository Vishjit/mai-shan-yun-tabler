import React, { useState } from "react";
import { TableStatus } from "../lib/data";
import { RiFilePaper2Line } from "react-icons/ri";

interface TableCardProps {
  id: number;
  displayNumber?: number;
  status: TableStatus;
  type: "table" | "marker";
  isSelected: boolean;
  isMoving?: boolean;
  onClick: () => void;
  onMoveToggle?: (id: number) => void;
  onCardMouseDown?: (e: React.MouseEvent, id: number) => void;
  onDelete?: (id: number) => void;
  onDoubleClick?: () => void;
}

export default function TableCard({
  id,
  displayNumber,
  status,
  type,
  isSelected,
  isMoving,
  onClick,
  onMoveToggle,
  onCardMouseDown,
  onDelete,
  onDoubleClick,
}: TableCardProps) {
  const [moveHover, setMoveHover] = useState(false);
  const [movePressed, setMovePressed] = useState(false);
  const [trashHover, setTrashHover] = useState(false);
  const [trashPressed, setTrashPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onDoubleClick={() => onDoubleClick?.()}
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
      {/* Small table heading */}
      {type === "table" && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
          Table {displayNumber ?? id}
        </div>
      )}
      {/* Controls */}
      {isSelected && (
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
          <RiFilePaper2Line className="w-14 h-14 text-[#57321F]" />
        )}
      </div>
    </div>
  );
}
