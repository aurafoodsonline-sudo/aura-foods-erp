'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { formatPrice } from "@/lib/utils";

interface User { id: number; name: string; email: string; role: string; }
interface Bundle { id: number; name: string; slug: string; price: number; oldPrice: number; isActive: boolean; isFeatured: boolean; _count: { items: number }; }

export default function AdminBundlesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetch("/api/admin/bundles", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => { setBundles(res.bundles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
  }

  async function toggleActive(bundle: Bundle) {
    const method = bundle.isActive ? "DELETE" : "PUT";
    const body = bundle.isActive ? undefined : JSON.stringify({ isActive: true });
    await fetch(`/api/admin/bundles/${bundle.id}`, {
      method, headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "include", body,
    });
    const res = await fetch("/api/admin/bundles", { credentials: "include" }).then((r) => r.json());
    setBundles(res.bundles || []);
  }

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bundles</h1>
            <p className="text-sm text-gray-500 mt-1">Manage product bundles and deals</p>
          </div>
          <Link href="/admin/bundles/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black hover:bg-gold-light rounded-lg text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Bundle
          </Link>
        </div>

        {bundles.length === 0 ? (
          <EmptyState title="No bundles yet" description="Create your first bundle deal." icon="📦" />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Items</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Featured</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bundles.map((bundle: any) => (
                    <tr key={bundle.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{bundle.name}</td>
                      <td className="py-3 px-4 text-gray-600">{bundle._count?.items ?? 0}</td>
                      <td className="py-3 px-4 text-gray-900">{formatPrice(bundle.price)}</td>
                      <td className="py-3 px-4">
                        {bundle.isFeatured ? <span className="text-gold font-medium">Yes</span> : <span className="text-gray-400">No</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${bundle.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {bundle.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/bundles/${bundle.id}`} className="px-3 py-1 text-xs font-medium text-gold hover:bg-gray-100 rounded-md transition-colors">Edit</Link>
                          <button onClick={() => toggleActive(bundle)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${bundle.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                            {bundle.isActive ? "Deactivate" : "Activate"}
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
