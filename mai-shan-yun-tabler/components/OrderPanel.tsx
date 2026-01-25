export default function OrderPanel({ table }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
        <h1 className="text-2xl font-bold">Table {table.id}</h1>

        <h2 className="mt-4 font-semibold">Orders</h2>
        {table.orders.length === 0 ? (
            <p className="text-gray-400">No orders yet</p>
        ) : (
        table.orders.map((o) => (
            <div key={o.itemId}>
                {o.name} × {o.quantity}
            </div>
        ))
    )}

        <h2 className="mt-4 font-semibold">Allergies</h2>
        {table.allergies.join(", ") || "None"}
    </div>
    );
}
