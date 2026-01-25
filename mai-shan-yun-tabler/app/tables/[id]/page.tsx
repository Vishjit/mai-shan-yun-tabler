// app/tables/[id]/page.tsx
import { tables } from "@/lib/data";
import OrderPanel from "@/components/OrderPanel";

interface PageProps {
  params: { id: string };
}

export default function TablePage({ params }: PageProps) {
  const tableID = Number(params.id);
  const table = tables.find(t => t.id === tableID);

  if (!table) return <div className="p-6">Table not found</div>;

  return (
    <main className="p-6">
      <OrderPanel table={table} /> {/* lowercase prop */}
    </main>
  );
}
