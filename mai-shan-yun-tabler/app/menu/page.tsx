  "use client";

import { useState, useRef, useEffect } from "react";
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
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickedOnItem = !!target.closest('.menu-item');
      if (selectedItem && !clickedOnItem && panelRef.current && !panelRef.current.contains(target)) {
        setSelectedItem(null);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedItem(null);
    }

    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [selectedItem]);

  return (
    <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#AF3939] text-[#FFFDFB] flex items-center justify-center text-xl font-bold z-50"
      >
        ←
      </button>

      {/* Title */}
      <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
        Menu
      </div>
      {/*mountiann*/}
      <Image
        src="/minimountain.svg"
        alt="mini mountain"
        width={480}
        height={360}
        className="fixed bottom-0 right-0 w-96 h-auto z-0 pointer-events-none"
      />

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
        className="absolute z-10 right-[3%] top-[10%] w-40 h-auto object-contain anim-cloud-long"
      />

      {/* MENU ITEMS - GROUPED BY CATEGORY  */}
      <div className="mt-56 px-16 pb-16 overflow-y-auto h-[calc(100vh-200px)]">
        {(() => {
          const categoryOrder = [
            'Lunch Special',
            'Special Offer',
            'Appetizer',
            'Rice Noodle',
            'Tossed Rice Noodle',
            'Ramen',
            'Tossed Ramen',
            'Fried Chicken',
            'Fried Rice',
            'Wonton',
            'Drink',
            'Additonal',
            'Mai Dessert',
            'Milk Tea',
            'Jas-Lemonade',
            'Fruit Tea',
            'Allergies & Restrictions',
          ];

          const getCategoryFor = (m: any) => {
            if (m.category) return m.category;
            if (m.description === 'Special Diet' || m.description === 'Allergies & Restrictions') return 'Allergies & Restrictions';
            return 'Uncategorized';
          };

          const allCategories = Array.from(new Set(menuItems.map(m => getCategoryFor(m))));
          const extras = allCategories.filter(c => !categoryOrder.includes(c));
          const ordered = [...categoryOrder, ...extras];

          return ordered.map(category => {
            const items = menuItems.filter(m => getCategoryFor(m) === category);
            return (
              <section key={category} className="mb-10">
                <div className="flex items-center justify-start gap-4 mb-4">
                  <h2 className="text-3xl font-bold mb-0 text-[#3D3D3D]">{category}</h2>
                  <span className="text-[#696159]">({items.length})</span>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {items.length > 0 ? (
                    items.map(item => (
                      <MenuItem
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        ingredients={item.ingredients}
                        onClick={() => {
                          setSelectedItem(item as any);
                          setQuantity(1);
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-4 text-[#696159] italic">No items in this category.</div>
                  )}
                </div>
              </section>
            );
          });
        })()}
      </div>

      {/* CURRENT ORDER */}
      {ticket && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 bg-[#FFFDFB] shadow-xl rounded-2xl p-6 w-80 z-40">
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
        <div ref={panelRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#FFFDFB] shadow-xl rounded-2xl px-8 py-4 flex items-center gap-6 z-50">
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
            className="bg-[#AF3939] text-[#FFFDFB] px-4 py-2 rounded-lg"
          >
            Add to Order
          </button>
        </div>
      )}



    </div>
  );
}
