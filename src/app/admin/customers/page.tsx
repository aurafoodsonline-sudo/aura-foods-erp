"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice } from "@/lib/utils";

interface Customer { id: number; name: string; phone: string; email: string; city: string; orderCount: number; totalSpent?: number; }
interface User { id: number; name: string; email: string; role: string; }

export default function AdminCustomersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch("/api/admin/customers").then(r => r.json()).then(d => {
        setCustomers(Array.isArray(d) ? d : []);
        setLoading(false);
      });
    });
  }, [router]);

  const filtered = customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="mb-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="border rounded px-3 py-2 w-full max-w-md" /></div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Name", "Phone", "Email", "City", "Orders", "Total Spent", ""].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600 text-sm">{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr> :
              filtered.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.phone || "-"}</td>
                  <td className="p-3 text-gray-500">{c.email || "-"}</td>
                  <td className="p-3 text-gray-500">{c.city || "-"}</td>
                  <td className="p-3">{c.orderCount || 0}</td>
                  <td className="p-3 font-medium">{c.totalSpent ? formatPrice(c.totalSpent) : "-"}</td>
                  <td className="p-3"><Link href={`/admin/customers/${c.id}`} className="text-gold hover:underline text-sm">View</Link></td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No customers found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
