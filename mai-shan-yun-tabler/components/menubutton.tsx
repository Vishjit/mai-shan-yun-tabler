import React, { useState } from "react";

export default function MenuButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block w-[4%] z-50 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? "/menubuttonhover.svg" : "/menubutton.svg"}
        alt="menu button"
        className="w-full h-auto block"
      />
        Menu
        
    </div>
  );
}
