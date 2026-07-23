"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order { id: number; orderNumber: string; customerName: string; customerPhone: string; total: number; status: string; createdAt: string; }
interface User { id: number; name: string; email: string; role: string; }

const STATUSES = ["All", "Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      loadOrders();
    });
  }, [router, filter]);

  const loadOrders = async () => {
    setLoading(true);
    const url = filter === "All" ? "/api/admin/orders" : `/api/admin/orders?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded text-sm font-medium ${filter === s ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{s}</button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Order #", "Customer", "Phone", "Total", "Status", "Date", ""].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600 text-sm">{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr> :
              orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{o.orderNumber}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3 text-gray-500">{o.customerPhone}</td>
                  <td className="p-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-sm text-gray-500">{formatDate(new Date(o.createdAt))}</td>
                  <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="text-emerald-700 hover:underline text-sm">View</Link></td>
                </tr>
              ))}
            {!loading && orders.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No orders found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
