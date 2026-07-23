"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number };
}

interface User {
  id: number; name: string; email: string; role: string;
}

export default function AdminCategoriesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch("/api/admin/categories").then(r => r.json()).then(setCategories).finally(() => setLoading(false));
    });
  }, [router]);

  const addCategory = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewName("");
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });
    if (res.ok) {
      setCategories(categories.map(c => c.id === id ? { ...c, isActive: !active } : c));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name" className="border rounded px-3 py-2 flex-1" onKeyDown={e => e.key === "Enter" && addCategory()} />
          <button onClick={addCategory} className="bg-gold text-black px-4 py-2 rounded hover:bg-gold-light">Add</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Name", "Slug", "Products", "Status", "Actions"].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.slug}</td>
                <td className="p-3">{c._count?.products || 0}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                <td className="p-3">
                  <button onClick={() => toggleActive(c.id, c.isActive)} className="text-amber-600 hover:underline text-sm">{c.isActive ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No categories yet</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
