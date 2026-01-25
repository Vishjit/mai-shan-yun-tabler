import React, { useState } from "react";

export default function AnalyticsButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block w-[4%] z-50 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? "/analyticsbuttonhover.svg" : "/analyticsbutton.svg"}
        alt="analytics button"
        className="w-full h-auto block"
      />
        Analytics
        
    </div>
  );
}
