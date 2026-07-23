"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
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
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      loadCategories();
    });
  }, [router]);

  const loadCategories = () => {
    fetch("/api/admin/categories").then(r => r.json()).then(data => {
      setCategories(data);
      setLoading(false);
    });
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDescription, image: newImage }),
    });
    if (res.ok) {
      loadCategories();
      setNewName("");
      setNewDescription("");
      setNewImage("");
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active }),
    });
    if (res.ok) loadCategories();
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditDescription(cat.description);
    setEditImage(cat.image);
  };

  const saveEdit = async () => {
    if (!editingCat || !editName.trim()) return;
    const res = await fetch(`/api/admin/categories/${editingCat.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription, image: editImage }),
    });
    if (res.ok) {
      setEditingCat(null);
      loadCategories();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 mb-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name" className="border rounded px-3 py-2 flex-1" onKeyDown={e => e.key === "Enter" && addCategory()} />
          <button onClick={addCategory} className="bg-gold text-black px-4 py-2 rounded hover:bg-gold-light whitespace-nowrap">Add Category</button>
        </div>
        <div className="flex gap-2">
          <input value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description (optional)" className="border rounded px-3 py-2 flex-1" />
          <input value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="Image URL (optional)" className="border rounded px-3 py-2 flex-1" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{["Name", "Slug", "Description", "Image", "Products", "Status", "Actions"].map(h => <th key={h} className="text-left p-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.slug}</td>
                <td className="p-3 text-gray-500 text-sm max-w-xs truncate">{c.description || "—"}</td>
                <td className="p-3">{c.image ? <img src={c.image} alt="" className="w-10 h-10 rounded object-cover" /> : "—"}</td>
                <td className="p-3">{c._count?.products || 0}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => toggleActive(c.id, c.isActive)} className="text-amber-600 hover:underline text-sm">{c.isActive ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No categories yet</td></tr>}
          </tbody>
        </table>
      </div>

      {editingCat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingCat(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={editImage} onChange={e => setEditImage(e.target.value)} className="border rounded px-3 py-2 w-full" />
                {editImage && <img src={editImage} alt="" className="mt-2 w-20 h-20 rounded object-cover" />}
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setEditingCat(null)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-gold text-black rounded hover:bg-gold-light font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
