"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice } from "@/lib/utils";

interface User { id: number; name: string; email: string; role: string; }

export default function AdminReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
    });
  }, [router]);

  if (!user) return null;

  const reports = [
    { title: "Sales Report", desc: "Daily sales totals, order counts, average order value", link: "/admin/reports/sales", icon: "💰" },
    { title: "Inventory Report", desc: "Stock valuation, low stock items, movement summary", link: "/admin/reports/inventory", icon: "📦" },
  ];

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(r => (
          <Link key={r.link} href={r.link} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">{r.icon}</div>
            <h2 className="font-semibold text-lg mb-2">{r.title}</h2>
            <p className="text-gray-500 text-sm">{r.desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
