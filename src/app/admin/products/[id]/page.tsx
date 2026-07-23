'use client';

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, slugify } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

interface InventoryStock {
  id: number;
  quantity: number;
  lowStockThreshold: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  tagline: string;
  description: string;
  ingredients: string;
  usage: string;
  price: number;
  oldPrice: number;
  weight: string;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  categoryId: number | null;
  images: ProductImage[];
  category: Category | null;
  inventoryStock: InventoryStock | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [usage, setUsage] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [imageUrls, setImageUrls] = useState("");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [isActive, setIsActive] = useState(true);

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
      fetch(`/api/admin/products/${id}`, { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/categories", { credentials: "include" }).then((r) => r.json()),
    ]).then(([productData, catData]) => {
      const p = productData.product;
      setName(p.name);
      setSlug(p.slug);
      setSku(p.sku);
      setTagline(p.tagline || "");
      setDescription(p.description || "");
      setIngredients(p.ingredients || "");
      setUsage(p.usage || "");
      setPrice(String(p.price));
      setOldPrice(p.oldPrice ? String(p.oldPrice) : "");
      setWeight(p.weight || "");
      setUnit(p.unit || "");
      setCategoryId(p.categoryId ? String(p.categoryId) : "");
      setIsFeatured(p.isFeatured);
      setIsBestSeller(p.isBestSeller);
      setIsNewArrival(p.isNewArrival);
      setIsActive(p.isActive);
      setExistingImages(p.images || []);
      setImageUrls((p.images || []).map((img: ProductImage) => img.url).join("\n"));
      setCategories(catData.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, id]);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(slugify(val));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !sku || !price) {
      setError("Name, SKU, and Price are required.");
      return;
    }

    setSaving(true);
    try {
      const images = imageUrls
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sku,
          name,
          price,
          oldPrice: oldPrice || undefined,
          tagline,
          description,
          ingredients,
          usage,
          weight,
          unit,
          categoryId: categoryId || undefined,
          isFeatured,
          isBestSeller,
          isNewArrival,
          isActive,
          images: images.length > 0 ? images : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Are you sure you want to deactivate this product?")) return;
    setSaving(true);
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: false }),
    });
    router.push("/admin/products");
  }

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

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 mt-1">Update product details</p>
          </div>
          {isActive && (
            <button onClick={handleDeactivate} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors border border-red-200">
              Deactivate
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {existingImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Current Image</h2>
            <img src={existingImages[0].url} alt={name} className="w-32 h-32 object-cover rounded-lg border" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <textarea rows={3} value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage</label>
              <textarea rows={3} value={usage} onChange={(e) => setUsage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Price (Rs.)</label>
              <input type="number" step="0.01" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm">
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flags</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300 text-emerald-700 focus:ring-emerald-600" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded border-gray-300 text-emerald-700 focus:ring-emerald-600" />
                Best Seller
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded border-gray-300 text-emerald-700 focus:ring-emerald-600" />
                New Arrival
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
            <textarea rows={3} value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Update Product"}
            </button>
            <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
