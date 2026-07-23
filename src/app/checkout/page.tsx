"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  price: number;
  weight: string | null;
  images: { url: string; alt: string }[];
}

function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("aura_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearCart() {
  localStorage.removeItem("aura_cart");
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    notes: "",
  });

  useEffect(() => {
    const items = getCart();
    setCartItems(items);

    if (items.length > 0) {
      const ids = items.map((i) => i.productId);
      fetch("/api/products/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const getProduct = (productId: number) =>
    products.find((p) => p.id === productId);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price || item.price || 0) * item.quantity;
  }, 0);

  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.customerPhone || !form.customerAddress || !form.customerCity) {
      setError("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const items = cartItems.map((item) => {
        const product = getProduct(item.productId);
        const unitPrice = product?.price || item.price || 0;
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        };
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push(`/checkout/confirmation?order=${data.order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '8rem 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin .6s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page" style={{ padding: '8rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Checkout</h1>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Add some products before checking out.</p>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ padding: '8rem 1.5rem 3rem', maxWidth: 720, margin: '0 auto' }}>
      <div className="breadcrumbs" style={{ display: 'flex', gap: '.5rem', fontSize: '.8125rem', color: 'var(--muted)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/cart" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Cart</Link>
        <span>/</span>
        <span className="current" style={{ color: 'var(--ink)', fontWeight: 600 }}>Checkout</span>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Checkout</h1>

      {error && (
        <div style={{ padding: '.75rem 1rem', background: '#f8d7da', color: '#721c24', borderRadius: '.75rem', textAlign: 'center', fontWeight: 500, marginTop: '1rem' }}>{error}</div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Full Name <span style={{ color: '#c0392b' }}>*</span></label>
          <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required placeholder="Enter your full name" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Phone Number <span style={{ color: '#c0392b' }}>*</span></label>
          <input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} required placeholder="03XX-XXXXXXX" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Email</label>
          <input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="your@email.com" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>City <span style={{ color: '#c0392b' }}>*</span></label>
          <input type="text" value={form.customerCity} onChange={(e) => setForm({ ...form, customerCity: e.target.value })} required placeholder="e.g. Karachi" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Delivery Address <span style={{ color: '#c0392b' }}>*</span></label>
          <textarea value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} rows={3} required placeholder="Street, house number, landmark" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)', resize: 'vertical' }} />
        </div>

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Payment Method</label>
          <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {[
              { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
              { value: 'jazzcash', label: 'JazzCash', desc: 'Manual verification required' },
              { value: 'easypaisa', label: 'Easypaisa', desc: 'Manual verification required' },
            ].map((opt) => (
              <label key={opt.value} className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', border: '1px solid var(--border)', borderRadius: '.75rem', cursor: 'pointer' }}>
                <input type="radio" name="payment" value={opt.value} defaultChecked={opt.value === 'cod'} style={{ accentColor: 'var(--gold)' }} />
                <div><strong>{opt.label}</strong><br /><span style={{ fontSize: '.8125rem', color: 'var(--muted)' }}>{opt.desc}</span></div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', fontSize: '.875rem', color: 'var(--muted)' }}>
            <span>Subtotal ({cartItems.length} items)</span><span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', fontSize: '.875rem', color: 'var(--muted)' }}>
            <span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `Rs. ${deliveryCharge}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', fontSize: '1.125rem', fontWeight: 700, borderTop: '1px solid var(--border)', marginTop: '.5rem', paddingTop: '1rem' }}>
            <span>Total</span><span style={{ color: 'var(--olive)' }}>Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-checkout" style={{ display: 'block', width: '100%', padding: '.875rem', borderRadius: 9999, background: 'linear-gradient(135deg, var(--gold), #d4b85a)', color: 'var(--ink)', fontWeight: 700, fontSize: '.9375rem', border: 'none', cursor: 'pointer', textAlign: 'center', marginTop: '1rem' }}>
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
