"use client";

import { useState, useEffect } from "react";
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

function saveCart(items: CartItem[]) {
  localStorage.setItem("aura_cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

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
        .then((data) => {
          setProducts(data.products || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter((item) => item.quantity > 0);

    setCartItems(updated);
    saveCart(updated);
  };

  const removeItem = (productId: number) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    saveCart(updated);
  };

  const getProduct = (productId: number) =>
    products.find((p) => p.id === productId);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price || item.price || 0) * item.quantity;
  }, 0);

  const deliveryCharge = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin .6s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '8rem 1.5rem 3rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '4rem', opacity: .3, marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Looks like you haven&apos;t added any spices yet.</p>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Browse Spices</Link>
        </div>
      ) : (
        <>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            {cartItems.map((item) => {
              const product = getProduct(item.productId);
              const imageUrl = product?.images?.[0]?.url;

              return (
                <div key={item.productId} className="cart-item" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <Link href={`/products/${product?.slug || ''}`}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product?.name || item.name} className="cart-item-img" style={{ width: 80, height: 80, borderRadius: '.5rem', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: '.5rem', background: 'rgba(10,10,10,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                  </Link>
                  <div className="cart-item-info" style={{ flex: 1 }}>
                    <Link href={`/products/${product?.slug || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="cart-item-name" style={{ fontWeight: 600, fontSize: '.9375rem' }}>{product?.name || item.name}</div>
                    </Link>
                    <div className="cart-item-price" style={{ color: 'var(--olive)', fontWeight: 600, marginTop: '.15rem' }}>
                      Rs. {(product?.price || item.price || 0).toLocaleString()}
                    </div>
                    <div className="cart-item-qty" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.5rem' }}>
                      <button onClick={() => updateQuantity(item.productId, -1)} className="qty-btn" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', fontSize: '.875rem', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>−</button>
                      <span style={{ fontSize: '.875rem', fontWeight: 600, width: 30, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, 1)} className="qty-btn" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', fontSize: '.875rem', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>+</button>
                      <button onClick={() => removeItem(item.productId)} style={{ marginLeft: '.5rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '.75rem', textDecoration: 'underline' }}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary" style={{ background: 'var(--card)', borderRadius: 8, border: '1px solid var(--border)', padding: '1.5rem', marginTop: '2rem' }}>
            <div className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', fontSize: '.875rem' }}>
              <span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', fontSize: '.875rem' }}>
              <span>Delivery</span><span>{deliveryCharge === 0 ? (subtotal >= 500 ? 'Free' : 'Rs. 0') : `Rs. ${deliveryCharge}`}</span>
            </div>
            {subtotal > 0 && subtotal < 500 && (
              <p style={{ fontSize: '.75rem', color: 'var(--gold)', textAlign: 'center', marginTop: '.5rem' }}>
                Add Rs. {(500 - subtotal).toLocaleString()} more for free delivery!
              </p>
            )}
            <div className="cart-summary-row cart-summary-total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '.5rem' }}>
              <span>Total</span><span style={{ color: 'var(--olive)' }}>Rs. {total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="btn-checkout" style={{ display: 'block', width: '100%', padding: '.875rem', borderRadius: 9999, background: 'linear-gradient(135deg, var(--gold), #d4b85a)', color: 'var(--ink)', fontWeight: 700, fontSize: '.9375rem', border: 'none', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
