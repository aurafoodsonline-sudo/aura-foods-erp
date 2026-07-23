"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

interface User { id: number; name: string; email: string; role: string; }

export default function AdminSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(data => {
      if (!data) { router.push("/admin/login"); return; }
      setUser(data);
      fetch("/api/admin/settings").then(r => r.json()).then(d => setSettings(d || {}));
    });
  }, [router]);

  const updateField = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: entries }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  const fields = ["site_name", "site_tagline", "phone", "email", "whatsapp"];

  return (
    <AdminLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button onClick={save} disabled={saving} className="bg-gold text-black px-4 py-2 rounded hover:bg-gold-light disabled:opacity-50">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f.replace(/_/g, " ")}</label>
              <input value={settings[f] || ""} onChange={e => updateField(f, e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
