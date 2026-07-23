"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order { id: number; orderNumber: string; total: number; status: string; createdAt: string; }
interface Customer { id: number; name: string; phone: string; email: string; address: string; city: string; notes: string; createdAt: string; orders: Order[]; }
interface User { id: number; name: string; email: string; role: string; }

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch(`/api/admin/customers/${params.id}`).then(r => r.json()).then(d => { setCustomer(d); setLoading(false); });
    });
  }, [router]);

  if (loading || !customer) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return null;

  const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0);

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Contact Info</h2>
          <div className="space-y-2">
            <p><span className="text-gray-500">Name:</span> {customer.name}</p>
            <p><span className="text-gray-500">Phone:</span> {customer.phone || "-"}</p>
            <p><span className="text-gray-500">Email:</span> {customer.email || "-"}</p>
            <p><span className="text-gray-500">Address:</span> {customer.address}, {customer.city}</p>
            <p><span className="text-gray-500">Customer since:</span> {formatDate(new Date(customer.createdAt))}</p>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Order History</h2>
            <p className="text-gray-500">Total spent: <span className="font-bold text-gold">{formatPrice(totalSpent)}</span></p>
          </div>
          <table className="w-full">
            <thead><tr className="border-b text-sm text-gray-500">{["Order #", "Date", "Total", "Status", ""].map(h => <th key={h} className="text-left p-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {customer.orders.map(o => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono text-sm">{o.orderNumber}</td>
                  <td className="p-2 text-sm text-gray-500">{formatDate(new Date(o.createdAt))}</td>
                  <td className="p-2 font-medium">{formatPrice(o.total)}</td>
                  <td className="p-2"><StatusBadge status={o.status} /></td>
                  <td className="p-2"><Link href={`/admin/orders/${o.id}`} className="text-gold hover:underline text-sm">View</Link></td>
                </tr>
              ))}
              {customer.orders.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
