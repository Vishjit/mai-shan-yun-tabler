import React from "react";
import { TableStatus } from "../lib/data";

interface TableCardProps {
  id: number;
  status: TableStatus;
  isSelected: boolean;
  onClick: () => void;
}

export default function Ticket({ id, status, isSelected, onClick }: TableCardProps) {
  return (
    <div>
           <img src="/reciept.svg" alt="reciept" className="w-[100%] h-auto z-0" />
    </div>
  );
}
