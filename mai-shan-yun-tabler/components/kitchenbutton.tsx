import React from "react";

export default function KitchenButton() {
  return (
    <div className="relative inline-block group w-[4%] z-50 pointer-events-auto">
      <img
        src="/kitchenbutton.svg"
        alt="kitchen button"
        className="w-full h-auto block transition-opacity duration-150 group-hover:opacity-0"
      />

      <img
        src="/kitchenbuttonhover.svg"
        alt="kitchen button hover"
        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />
    </div>
  );
}
