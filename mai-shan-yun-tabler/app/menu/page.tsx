"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { menuItems } from "@/lib/menu";
import MenuItem from "@/components/MenuItem";

export default function Menu() {
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
      
      {/* Title */}
      <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
        Menu
      </div>

      {/* Clouds */}
      <img
        src="/cloud (1).svg"
        alt="cloud"
        className="absolute z-10 left-[30%] top-[5%] w-[7%] h-auto object-contain anim-cloud"
      />
      <img
        src="/cloud (2).svg"
        alt="cloud"
        className="absolute z-10 right-[3% ] top-[10%] w-[160px] h-auto object-contain anim-cloud-long"
      />

      {/* MENU ITEMS */}
      <div className="grid grid-cols-4 gap-6 mt-56 px-16">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            ingredients={item.ingredients}
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
            }}
          />
        ))}
      </div>

      {selectedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-4 flex items-center gap-6 z-50">
          <span className="font-semibold text-lg">{selectedItem.name}</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full bg-gray-200 text-xl font-bold"
            >
              −
            </button>

            <span className="w-6 text-center text-lg">{quantity}</span>

            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-9 h-9 rounded-full bg-gray-200 text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
