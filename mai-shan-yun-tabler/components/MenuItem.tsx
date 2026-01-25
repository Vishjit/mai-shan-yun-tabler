"use client";

interface MenuItemProps {
  name: string;
  price: number;
  ingredients?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  orderCount?: number | string;
}

export default function MenuItem({
  name,
  price,
  ingredients,
  onClick,
  className,
  orderCount,
}: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={`relative z-30 cursor-pointer bg-white rounded-2xl shadow-md p-4 border-2 border-[#3D3D3D] hover:border-[#AF3939] active:border-[#AF3939] hover:scale-[1.02] hover:z-40 transition ${className || ""}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{name}</h3>
        <span className="text-lg font-bold">${price.toFixed(2)}</span>
      </div>

      {ingredients && <p className="text-sm text-gray-500 mt-1">{ingredients}</p>}

      {orderCount !== undefined && (
        <div className="absolute bottom-3 right-4 text-sm text-[#696159]">Orders: {orderCount}</div>
      )}
    </div>
  );
}
