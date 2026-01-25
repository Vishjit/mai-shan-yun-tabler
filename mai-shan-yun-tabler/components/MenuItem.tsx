"use client";

interface MenuItemProps {
  name: string;
  price: number;
  ingredients?: string;
  description?: string;
  onClick?: () => void;
}

export default function MenuItem({
  name,
  price,
  ingredients,
  onClick,
}: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md p-4 hover:scale-[1.02] transition"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{name}</h3>
        <span className="text-lg font-bold">${price.toFixed(2)}</span>
      </div>

      {ingredients && (
        <p className="text-sm text-gray-500 mt-1">{ingredients}</p>
      )}
    </div>
  );
}
