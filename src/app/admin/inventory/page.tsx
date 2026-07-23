"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice } from "@/lib/utils";

interface StockItem { id: number; quantity: number; lowStockThreshold: number; product: { id: number; name: string; sku: string; price: number; isActive: boolean; }; }
interface User { id: number; name: string; email: string; role: string; }

export default function AdminInventoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<StockItem[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showForm, setShowForm] = useState<{ productId: number; type: string } | null>(null);
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadInventory = async () => {
    setLoading(true);
    const url = lowStockOnly ? "/api/admin/inventory?lowStock=true" : "/api/admin/inventory";
    const res = await fetch(url);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      loadInventory();
    });
  }, [router, lowStockOnly]);

  const adjustStock = async (productId: number) => {
    const type = showForm?.type || "ADJUSTMENT";
    const quantity = parseFloat(qty);
    if (isNaN(quantity) || quantity <= 0) return;
    const res = await fetch("/api/admin/inventory", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type, quantity, notes }),
    });
    if (res.ok) {
      setShowForm(null); setQty(""); setNotes("");
      loadInventory();
    }
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Stock</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} className="rounded" />
          Low stock only
        </label>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Product", "SKU", "Stock", "Threshold", "Value", "Status", "Actions"].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600 text-sm">{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr> :
              items.map(item => {
                const isLow = item.quantity <= item.lowStockThreshold;
                const isOut = item.quantity <= 0;
                return (
                  <tr key={item.id} className={`border-t hover:bg-gray-50 ${isLow ? "bg-amber-50" : ""}`}>
                    <td className="p-3 font-medium">{item.product.name}</td>
                    <td className="p-3 text-gray-500 text-sm">{item.product.sku}</td>
                    <td className="p-3 font-mono">{item.quantity}</td>
                    <td className="p-3 text-sm text-gray-500">{item.lowStockThreshold}</td>
                    <td className="p-3">{formatPrice(item.product.price * item.quantity)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${isOut ? "bg-red-100 text-red-800" : isLow ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"].map(t => (
                          <button key={t} onClick={() => { setShowForm({ productId: item.product.id, type: t }); setQty(""); setNotes(""); }} className={`text-xs px-2 py-1 rounded ${t === "STOCK_IN" ? "bg-green-100 text-green-700" : t === "STOCK_OUT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                            {t === "STOCK_IN" ? "+In" : t === "STOCK_OUT" ? "-Out" : "Adj"}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            {!loading && items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No inventory items found</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(null)}>
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Stock {showForm.type.replace("_", " ")}</h3>
            <p className="text-sm text-gray-500 mb-4">Product ID: {showForm.productId}</p>
            <input value={qty} onChange={e => setQty(e.target.value)} type="number" placeholder="Quantity" className="border rounded px-3 py-2 w-full mb-3" min="0" step="0.001" />
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" className="border rounded px-3 py-2 w-full mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(null)} className="px-4 py-2 rounded border hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={() => adjustStock(showForm.productId)} className="px-4 py-2 rounded bg-gold text-black text-sm hover:bg-gold-light">Submit</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
