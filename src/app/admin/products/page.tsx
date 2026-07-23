'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { formatPrice } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ProductImage {
  url: string;
  isPrimary: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface InventoryStock {
  quantity: number;
  lowStockThreshold: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  isActive: boolean;
  slug: string;
  images: ProductImage[];
  category: Category | null;
  inventoryStock: InventoryStock | null;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (!res.user) { router.push("/admin/login"); return; }
        setUser(res.user);
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  function fetchProducts() {
    if (!user) return;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/admin/products?${params.toString()}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    if (user) fetchProducts();
  }, [user, search]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
  }

  async function toggleActive(product: Product) {
    if (product.isActive) {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } else {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: true }),
      });
    }
    fetchProducts();
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black hover:bg-gold-light rounded-lg text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none text-sm"
          />
        </div>

        {products.length === 0 ? (
          <EmptyState title="No products found" description="Try adjusting your search or add a new product." icon="📦" />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Image</th>
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">SKU</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Stock</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                      <td className="py-3 px-4 text-gray-600">{product.category?.name || "-"}</td>
                      <td className="py-3 px-4 text-gray-900">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4 text-gray-600">{product.inventoryStock?.quantity ?? "-"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 text-xs font-medium text-gold hover:bg-gray-100 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleActive(product)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${product.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                          >
                            {product.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
