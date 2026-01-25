import { TableStatus } from "../lib/data";

interface StatusSelectorProps {
  value: TableStatus;
  onChange: (status: TableStatus) => void;
}

export default function StatusSelector({
  value,
  onChange,
}: StatusSelectorProps) {
  const options: { status: TableStatus; color: string }[] = [
    { status: "available", color: "bg-green-300" },
    { status: "ordering", color: "bg-amber-300" },
    { status: "alert", color: "bg-red-300" },
  ];

  return (
    <div className="flex space-x-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt.status}
          onClick={() => onChange(opt.status)}
          className={`
            w-3.5 h-3.5 rounded-full
            ${opt.color}
            transition-all
            ${
              value === opt.status
                ? "scale-125 ring-2 ring-gray-600"
                : "opacity-60 hover:scale-110"
            }
          `}
          aria-label={`Set status to ${opt.status}`}
        />
      ))}
    </div>
  );
}
