import React, { useState } from "react";

export default function TableButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block w-[4%] z-50 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? "/tablesbuttonhover.svg" : "/tablesbutton.svg"}
        alt="table button"
        className="w-full h-auto block"
      />
        Table
        
    </div>
  );
}
