import React from "react";

export default function Menubutton() {
  return (
    <div className="relative inline-block group w-[5%]">
      <img
        src="/menubutton.svg"
        alt="menubutton"
        className="w-full h-auto block transition-opacity duration-150 group-hover:opacity-0"
      />

      <img
        src="/menubuttonhover.svg"
        alt="menubuttonhover"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />
    </div>
  );
}
