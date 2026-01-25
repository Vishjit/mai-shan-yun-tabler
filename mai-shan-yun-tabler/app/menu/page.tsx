"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { menuItems } from "@/lib/menu";
import MenuItem from "@/components/MenuItem";
import { useTickets, Receipt } from "@/context/ticketContext";

interface MenuItemType {
  id: number;
  name: string;
  price: number;
  ingredients: string;
}

export default function Menu() {
  const searchParams = useSearchParams();
  const ticketId = parseInt(searchParams.get('ticketId') || '0');
  const { getTicketById, addItemToTicket, getReceiptForTicket } = useTickets();
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const ticket = getTicketById(ticketId);
  const receipt = ticket ? getReceiptForTicket(ticketId) : null;

  const formatReceipt = (receipt: Receipt) => {
    let text = 'Receipt\n\n';
    receipt.lines.forEach((line) => {
      text += `${line.name} x${line.quantity} - $${line.lineTotal.toFixed(2)}\n`;
    });
    text += `\nSubtotal: $${receipt.subtotal.toFixed(2)}\n`;
    return text;
  };

  return (
    <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#AF3939] text-white flex items-center justify-center text-xl font-bold z-50"
      >
        ←
      </button>

      {/* Title */}
      <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
        Menu
      </div>

      {/* Clouds */}
      <Image
        src="/cloud (1).svg"
        alt="cloud"
        width={100}
        height={100}
        className="absolute z-10 left-[30%] top-[5%] w-[7%] h-auto object-contain anim-cloud"
      />
      <Image
        src="/cloud (2).svg"
        alt="cloud"
        width={160}
        height={100}
        className="absolute z-10 right-[3%] top-[10%] w-[160px] h-auto object-contain anim-cloud-long"
      />

      {/* MENU ITEMS - GROUPED BY CATEGORY */}
      <div className="mt-56 px-16 pb-16 overflow-y-auto h-[calc(100vh-200px)]">
        {/* Appetizers */}
        {menuItems.filter(item => item.description === "Appetizer").length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-[#57321F]">Appetizers</h2>
            <div className="grid grid-cols-4 gap-6">
              {menuItems.filter(item => item.description === "Appetizer").map(item => (
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
          </div>
        )}

        {/* Entrees */}
        {menuItems.filter(item => item.description === "Entree").length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-[#57321F]">Entrees</h2>
            <div className="grid grid-cols-4 gap-6">
              {menuItems.filter(item => item.description === "Entree").map(item => (
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
          </div>
        )}

        {/* Desserts */}
        {menuItems.filter(item => item.description === "Dessert").length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-[#57321F]">Desserts</h2>
            <div className="grid grid-cols-4 gap-6">
              {menuItems.filter(item => item.description === "Dessert").map(item => (
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
          </div>
        )}

        {/* Allergies & Restrictions */}
        {menuItems.filter(item => item.description === "Special Diet").length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-[#57321F]">Allergies & Restrictions</h2>
            <div className="grid grid-cols-4 gap-6">
              {menuItems.filter(item => item.description === "Special Diet").map(item => (
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
          </div>
        )}
      </div>

      {/* CURRENT ORDER */}
      {ticket && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl p-6 w-80 z-40">
          <h3 className="font-bold text-lg mb-4">Current Order - Table {ticket.tableNumber}</h3>
          {ticket.items.map((item, index) => (
            <div key={index} className="mb-2">
              {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
            </div>
          ))}
          {receipt && (
            <div className="mt-4 pt-4 border-t">
              <strong>Subtotal: ${receipt.subtotal.toFixed(2)}</strong>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                {formatReceipt(receipt)}
              </pre>
            </div>
          )}
        </div>
      )}

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

          <button
            onClick={() => {
              if (selectedItem && ticket) {
                addItemToTicket(ticketId, { id: selectedItem.id.toString(), name: selectedItem.name, price: selectedItem.price, quantity });
                setSelectedItem(null);
                setQuantity(1);
              }
            }}
            className="bg-[#AF3939] text-white px-4 py-2 rounded-lg"
          >
            Add to Order
          </button>
        </div>
      )}

    </div>
  );
}
