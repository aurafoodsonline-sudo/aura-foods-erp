"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice } from "@/lib/utils";

interface User { id: number; name: string; email: string; role: string; }

export default function InventoryReportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch("/api/admin/reports/inventory").then(r => r.json()).then(d => { setData(d); setLoading(false); });
    });
  }, [router]);

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Inventory Report</h1>
      {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Total Inventory Value</p><p className="text-2xl font-bold">{formatPrice(data.totalValue || 0)}</p></div>
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Low Stock Items</p><p className="text-2xl font-bold text-amber-600">{data.lowStockCount || 0}</p></div>
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Total Movements</p><p className="text-2xl font-bold">{data.totalMovements || 0}</p></div>
          </div>
          {data.lowStockItems && data.lowStockItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4">Low Stock Items</h2>
              <table className="w-full"><thead><tr className="border-b text-sm text-gray-500">{["Product", "Stock", "Threshold"].map(h => <th key={h} className="text-left p-2 font-medium">{h}</th>)}</tr></thead>
                <tbody>{data.lowStockItems.map((item: any) => (
                  <tr key={item.id} className="border-b"><td className="p-2">{item.product.name}</td><td className="p-2 font-mono">{item.quantity}</td><td className="p-2">{item.lowStockThreshold}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {data.movementSummary && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-lg mb-4">Movement Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.movementSummary).map(([k, v]) => (
                  <div key={k} className="text-center p-4 bg-gray-50 rounded"><p className="text-lg font-bold">{v as number}</p><p className="text-sm text-gray-500">{k}</p></div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
