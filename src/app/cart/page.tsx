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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-emerald-100">
            Review your items and proceed to checkout.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven&apos;t added any products yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Browse Products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = getProduct(item.productId);
              const imageUrl = product?.images?.[0]?.url;

              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                >
                  <Link
                    href={`/products/${product?.slug || ""}`}
                    className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product?.name || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product?.slug || ""}`}
                      className="text-sm font-semibold text-gray-900 hover:text-emerald-700 transition-colors line-clamp-1"
                    >
                      {product?.name || item.name}
                    </Link>
                    {product?.weight && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.weight}
                      </p>
                    )}
                    <p className="text-sm font-bold text-emerald-700 mt-1">
                      Rs.{" "}
                      {((product?.price || item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0
                      ? subtotal >= 500
                        ? "Free"
                        : "Rs. 0"
                      : `Rs. ${deliveryCharge}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 500 && (
                  <p className="text-xs text-amber-600">
                    Add Rs. {(500 - subtotal).toLocaleString()} more for free
                    delivery!
                  </p>
                )}
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-emerald-700">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 block w-full text-center text-sm text-gray-500 hover:text-emerald-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}