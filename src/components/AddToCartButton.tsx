'use client';

import { useState, useEffect } from 'react';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  price: number;
  className?: string;
}

interface CartItem {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
}

function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('aura_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem('aura_cart', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch { /* localStorage may be unavailable (private browsing, etc.) */ }
}

export default function AddToCartButton({ productId, productName, price, className }: AddToCartButtonProps) {
  const [feedback, setFeedback] = useState<'idle' | 'added'>('idle');

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = getCart();
    const item = cart.find((i) => i.productId === productId);
    if (item) setQuantity(item.quantity);
  }, [productId]);

  useEffect(() => {
    const handler = () => {
      const cart = getCart();
      const item = cart.find((i) => i.productId === productId);
      setQuantity(item?.quantity || 0);
    };
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, [productId]);

  const addToCart = () => {
    try {
      const cart = getCart();
      const existing = cart.find((i) => i.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ productId, quantity: 1, name: productName, price });
      }

      saveCart(cart);
      setFeedback('added');
      setTimeout(() => setFeedback('idle'), 1500);
    } catch { /* guard */ }
  };

  const updateQuantity = (delta: number) => {
    const cart = getCart();
    const existing = cart.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity = Math.max(0, existing.quantity + delta);
      if (existing.quantity === 0) {
        const idx = cart.findIndex((i) => i.productId === productId);
        if (idx !== -1) cart.splice(idx, 1);
      }
      saveCart(cart);
      setFeedback(delta > 0 ? 'added' : 'idle');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };

  if (quantity > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <button
          onClick={() => updateQuantity(-1)}
          style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', fontSize: '1rem', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all .2s' }}
          aria-label="Decrease quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span style={{ width: 32, textAlign: 'center', fontSize: '.875rem', fontWeight: 600 }}>{quantity}</span>
        <button
          onClick={() => updateQuantity(1)}
          style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', fontSize: '1rem', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all .2s' }}
          aria-label="Increase quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={addToCart}
      className={className || 'btn-add-cart'}
      style={className ? undefined : { width: '100%', marginTop: '.75rem', padding: '.65rem', borderRadius: 9999, border: '1px solid var(--olive)', background: feedback === 'added' ? 'var(--olive)' : 'transparent', color: feedback === 'added' ? '#fff' : 'var(--olive)', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all .3s' }}
    >
      {feedback === 'added' ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
