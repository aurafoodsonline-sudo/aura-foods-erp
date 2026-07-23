'use client';

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User { id: number; name: string; email: string; role: string; }
interface Product { id: number; name: string; price: number; }
interface BundleItem { id: number; productId: number; quantity: number; product: { id: number; name: string; price: number; }; }

export default function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<{ productId: number; quantity: number }[]>([]);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (!res.user) { router.push("/admin/login"); return; }
        setUser(res.user);
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/admin/bundles/${id}`, { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/products", { credentials: "include" }).then((r) => r.json()),
    ]).then(([bundleData, prodData]) => {
      const b = bundleData.bundle;
      setName(b.name);
      setTagline(b.tagline || "");
      setDescription(b.description || "");
      setPrice(String(b.price));
      setOldPrice(b.oldPrice ? String(b.oldPrice) : "");
      setImage(b.image || "");
      setIsFeatured(b.isFeatured);
      setIsActive(b.isActive);
      setSelectedProducts((b.items || []).map((item: BundleItem) => ({ productId: item.productId, quantity: item.quantity })));
      setProducts(prodData.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, id]);

  function toggleProduct(productId: number) {
    setSelectedProducts((prev) =>
      prev.some((p) => p.productId === productId)
        ? prev.filter((p) => p.productId !== productId)
        : [...prev, { productId, quantity: 1 }]
    );
  }

  function updateQuantity(productId: number, quantity: number) {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p))
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !price) { setError("Name and price are required."); return; }
    if (selectedProducts.length === 0) { setError("Select at least one product."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bundles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name, tagline, description,
          price, oldPrice: oldPrice || undefined,
          image, isFeatured, isActive,
          productIds: selectedProducts,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update bundle"); return; }
      router.push("/admin/bundles");
    } catch { setError("An error occurred."); }
    finally { setSaving(false); }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate this bundle?")) return;
    await fetch(`/api/admin/bundles/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ isActive: false }),
    });
    router.push("/admin/bundles");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
  }

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Bundle</h1>
            <p className="text-sm text-gray-500 mt-1">Update bundle details</p>
          </div>
          {isActive && (
            <button onClick={handleDeactivate} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors border border-red-200">
              Deactivate
            </button>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        {image && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Current Image</h2>
            <img src={image} alt={name} className="w-32 h-32 object-cover rounded-lg border" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Price (Rs.)</label>
              <input type="number" step="0.01" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300 text-gold focus:ring-gold" />
              Show as featured bundle
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Products in Bundle *</label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedProducts.some((sp) => sp.productId === p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="flex-1 text-sm text-gray-900">{p.name}</span>
                  {selectedProducts.some((sp) => sp.productId === p.id) && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Qty:</label>
                      <input
                        type="number"
                        min={1}
                        value={selectedProducts.find((sp) => sp.productId === p.id)?.quantity || 1}
                        onChange={(e) => updateQuantity(p.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-gold text-black hover:bg-gold-light rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Update Bundle"}
            </button>
            <button type="button" onClick={() => router.push("/admin/bundles")} className="px-6 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
