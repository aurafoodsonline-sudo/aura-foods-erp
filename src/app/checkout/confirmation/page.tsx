"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="order-confirm" style={{ padding: '8rem 1.5rem 3rem', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <div className="checkmark" style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--olive)', display: 'grid', placeItems: 'center', margin: '0 auto 2rem', fontSize: '2.5rem', color: '#fff' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>Order Placed Successfully!</h1>
      <p style={{ color: 'var(--muted)', marginTop: '.75rem', lineHeight: 1.7 }}>
        Thank you for your order. We&apos;ll process it shortly.
      </p>
      {orderNumber && (
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gold)', marginTop: '1rem' }}>
          Order Number: {orderNumber}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '2rem', alignItems: 'center' }}>
        <Link href="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Continue Shopping</Link>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.875rem' }}>Back to Home</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '8rem 1.5rem 3rem', textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin .6s linear infinite', margin: '0 auto' }} />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
