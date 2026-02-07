import React, { useState } from "react";

export default function TableButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center z-50 cursor-pointer font-['Jost'] text-center"
      style={{ width: 80 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? "/tableshover.svg" : "/tablesbutton.svg"}
        alt="table button"
        className="w-full h-auto block object-contain"
      />

      <span className="mt-2  text-sm">Tables</span>
    </div>
  );
}
