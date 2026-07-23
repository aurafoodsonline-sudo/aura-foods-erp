"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { formatDate } from "@/lib/utils";

interface Transaction { id: number; type: string; quantity: number; reference: string; notes: string; createdAt: string; product: { name: string; sku: string; }; user?: { name: string; }; }
interface User { id: number; name: string; email: string; role: string; }

const TYPE_COLORS: Record<string, string> = { STOCK_IN: "bg-green-100 text-green-800", STOCK_OUT: "bg-red-100 text-red-800", ADJUSTMENT: "bg-blue-100 text-blue-800", SALE: "bg-purple-100 text-purple-800", RETURN: "bg-amber-100 text-amber-800" };

export default function InventoryTransactionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch("/api/admin/inventory/transactions").then(r => r.json()).then(d => { setTransactions(Array.isArray(d) ? d : []); setLoading(false); });
    });
  }, [router]);

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Stock Movement History</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Date", "Product", "SKU", "Type", "Quantity", "Notes", "By"].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600 text-sm">{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr> :
              transactions.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-500">{formatDate(new Date(t.createdAt))}</td>
                  <td className="p-3 font-medium">{t.product.name}</td>
                  <td className="p-3 text-sm text-gray-500">{t.product.sku}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[t.type] || "bg-gray-100 text-gray-800"}`}>{t.type}</span></td>
                  <td className="p-3 font-mono">{t.quantity}</td>
                  <td className="p-3 text-sm text-gray-500">{t.notes || "-"}</td>
                  <td className="p-3 text-sm text-gray-500">{t.user?.name || "-"}</td>
                </tr>
              ))}
            {!loading && transactions.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No transactions yet</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
