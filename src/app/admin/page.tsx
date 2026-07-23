'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  inventoryStock: { quantity: number; lowStockThreshold: number };
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; phone: string };
}

interface SalesDataPoint {
  date: string;
  sales: number;
}

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalSales: number;
  inventoryValue: number;
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
  salesData: SalesDataPoint[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (!res.user) {
          router.push("/admin/login");
          return;
        }
        setUser(res.user);
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/dashboard", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <AdminLayout user={user} onLogout={handleLogout}>
        <div className="text-center py-12 text-gray-500">Failed to load dashboard data.</div>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "Total Sales", value: formatPrice(data.totalSales), color: "text-gold" },
    { label: "Total Orders", value: data.totalOrders, color: "text-blue-700" },
    { label: "Pending Orders", value: data.pendingOrders, color: "text-amber-600" },
    { label: "Total Products", value: data.totalProducts, color: "text-indigo-700" },
    { label: "Total Categories", value: data.totalCategories, color: "text-purple-700" },
    { label: "Inventory Value", value: formatPrice(data.inventoryValue), color: "text-gold" },
    { label: "Total Customers", value: data.totalCustomers, color: "text-cyan-700" },
  ];

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days Sales</h2>
            {data.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: any) => typeof value === 'number' ? formatPrice(value) : value} />
                  <Bar dataKey="sales" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm py-12 text-center">No sales data available</p>
            )}
          </div>

          {data.lowStockProducts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-5">
              <h2 className="text-lg font-semibold text-amber-700 mb-4">
                Low Stock Alert ({data.lowStockProducts.length})
              </h2>
              <div className="space-y-2">
                {data.lowStockProducts.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-800 font-medium">{p.name}</span>
                    <span className="text-sm text-red-600 font-semibold">
                      {p.inventoryStock.quantity} / {p.inventoryStock.lowStockThreshold}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 font-medium">Order #</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="py-3 text-gray-700">{order.customer.name}</td>
                      <td className="py-3 text-gray-900">{formatPrice(order.total)}</td>
                      <td className="py-3"><StatusBadge status={order.status} /></td>
                      <td className="py-3 text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
