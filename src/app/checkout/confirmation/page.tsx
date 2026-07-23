"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-500 mb-2">
        Thank you for your order. We&apos;ll process it shortly.
      </p>
      {orderNumber && (
        <p className="text-lg font-semibold text-gold mb-8">
          Order Number: {orderNumber}
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black px-8 py-3 rounded-lg font-semibold transition-all"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold px-8 py-3 rounded-lg font-semibold transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Order Confirmation</h1>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-700 border-t-gold rounded-full mx-auto" />
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}