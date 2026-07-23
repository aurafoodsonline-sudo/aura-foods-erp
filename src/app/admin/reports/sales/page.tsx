"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface User { id: number; name: string; email: string; role: string; }

export default function SalesReportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      loadReport();
    });
  }, [router]);

  const loadReport = async () => {
    setLoading(true);
    let url = "/api/admin/reports/sales";
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    if (qs) url += "?" + qs;
    const res = await fetch(url);
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Sales Report</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div><label className="block text-sm text-gray-500 mb-1">From</label><input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-3 py-1.5" /></div>
          <div><label className="block text-sm text-gray-500 mb-1">To</label><input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-3 py-1.5" /></div>
          <button onClick={loadReport} className="bg-emerald-700 text-white px-4 py-1.5 rounded hover:bg-emerald-800">Apply</button>
        </div>
      </div>
      {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Total Sales</p><p className="text-2xl font-bold">{formatPrice(data.totalSales || 0)}</p></div>
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Total Orders</p><p className="text-2xl font-bold">{data.totalOrders || 0}</p></div>
            <div className="bg-white rounded-lg shadow p-6"><p className="text-gray-500 text-sm">Avg Order Value</p><p className="text-2xl font-bold">{formatPrice(data.avgOrderValue || 0)}</p></div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Daily Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dailySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
