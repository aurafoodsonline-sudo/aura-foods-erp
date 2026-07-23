'use client';

import { useState, useCallback } from 'react';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  price: number;
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
  localStorage.setItem('aura_cart', JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

export default function AddToCartButton({ productId, productName, price }: AddToCartButtonProps) {
  const [feedback, setFeedback] = useState<'idle' | 'added' | 'updated'>('idle');

  const getItemQuantity = useCallback((): number => {
    const cart = getCart();
    const item = cart.find((i) => i.productId === productId);
    return item?.quantity || 0;
  }, [productId]);

  const [quantity, setQuantity] = useState(getItemQuantity);

  const addToCart = () => {
    const cart = getCart();
    const existing = cart.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1, name: productName, price });
    }

    saveCart(cart);
    setQuantity((q) => q + 1);
    setFeedback('added');
    setTimeout(() => setFeedback('idle'), 1500);
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
      setQuantity((q) => Math.max(0, q + delta));
      setFeedback(delta > 0 ? 'added' : 'updated');
      setTimeout(() => setFeedback('idle'), 1500);
    }
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
        <button
          onClick={() => updateQuantity(1)}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={addToCart}
      className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        feedback === 'added'
          ? 'bg-green-600 text-white'
          : 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95'
      }`}
    >
      {feedback === 'added' ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
