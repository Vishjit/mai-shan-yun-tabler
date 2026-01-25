import React, { useState } from "react";

export default function AnalyticsButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center w-[80px] z-50 cursor-pointer font-['Jost'] text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? "/analyticsbuttonhover.svg" : "/analyticsbutton.svg"}
        alt="analytics button"
        className="w-full h-auto block object-contain"
      />

      <span className="mt-2  text-sm">Analytics</span>
    </div>
  );
}
