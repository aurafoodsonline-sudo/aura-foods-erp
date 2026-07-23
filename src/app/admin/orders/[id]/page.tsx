"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderItem { id: number; quantity: number; unitPrice: number; totalPrice: number; product: { id: number; name: string; sku: string; }; }
interface Order { id: number; orderNumber: string; status: string; subtotal: number; deliveryCharge: number; total: number; notes: string; customerName: string; customerEmail: string; customerPhone: string; customerAddress: string; customerCity: string; createdAt: string; items: OrderItem[]; customer?: { id: number; name: string; }; user?: { id: number; name: string; }; }
interface User { id: number; name: string; email: string; role: string; }

const STATUSES = ["Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      loadOrder();
    });
  }, [router]);

  const loadOrder = async () => {
    const res = await fetch(`/api/admin/orders/${params.id}`);
    const data = await res.json();
    setOrder(data);
    setNewStatus(data.status);
    setLoading(false);
  };

  const updateStatus = async () => {
    const res = await fetch(`/api/admin/orders/${params.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) loadOrder();
  };

  if (loading || !order) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <button onClick={() => window.print()} className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm">Print</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Order Items</h2>
            <table className="w-full">
              <thead><tr className="border-b text-sm text-gray-500">{["Product", "SKU", "Qty", "Unit Price", "Total"].map(h => <th key={h} className="text-left p-2 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.product.name}</td>
                    <td className="p-2 text-gray-500">{item.product.sku}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{formatPrice(item.unitPrice)}</td>
                    <td className="p-2 font-medium">{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 border-t pt-4 space-y-1 text-right">
              <p className="text-gray-500">Subtotal: {formatPrice(order.subtotal)}</p>
              <p className="text-gray-500">Delivery: {formatPrice(order.deliveryCharge)}</p>
              <p className="text-xl font-bold">Total: {formatPrice(order.total)}</p>
            </div>
          </div>
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold mb-2">Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Status</h2>
            <StatusBadge status={order.status} />
            <div className="mt-4 flex gap-2">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="border rounded px-2 py-1 text-sm flex-1">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={updateStatus} className="bg-emerald-700 text-white px-3 py-1 rounded text-sm hover:bg-emerald-800">Update</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Customer</h2>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.customerName}</p>
              <p><span className="text-gray-500">Phone:</span> {order.customerPhone}</p>
              <p><span className="text-gray-500">Email:</span> {order.customerEmail || "-"}</p>
              <p><span className="text-gray-500">Address:</span> {order.customerAddress}, {order.customerCity}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">Order Info</h2>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Date:</span> {formatDate(new Date(order.createdAt))}</p>
              <p><span className="text-gray-500">Order #:</span> {order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
