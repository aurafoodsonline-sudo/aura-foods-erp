'use client';

import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  weight?: string | null;
  tagline?: string | null;
  images?: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showBadge?: string | false;
}

export default function ProductCard({ product, showAddToCart = true, showBadge }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url;
  const imageAlt = product.images?.[0]?.alt || product.name;

  return (
    <div className="product-card fade-up" style={{ position: 'relative', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', transition: 'all .3s' }}>
      <Link href={`/products/${product.slug}`} className="card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {showBadge && (
          <span className="card-badge card-badge-seller" style={{ position: 'absolute', top: '.75rem', left: '.75rem', fontSize: '.625rem', textTransform: 'uppercase', letterSpacing: '.1em', padding: '.35rem .75rem', borderRadius: 9999, fontWeight: 700, zIndex: 2, background: 'var(--gold)', color: 'var(--ink)' }}>
            {showBadge}
          </span>
        )}
        <div style={{ aspectRatio: '1/1', background: 'rgba(10,10,10,0.03)', overflow: 'hidden' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )}
        </div>
      </Link>

      <div className="product-info" style={{ padding: '1rem 1.25rem 1.25rem' }}>
        <Link href={`/products/${product.slug}`} className="card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="product-name" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1rem' }}>{product.name}</div>
          {product.tagline && (
            <div className="product-tagline" style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.15rem' }}>{product.tagline}</div>
          )}
          <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '.5rem' }}>
            <span className="product-price" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--olive)' }}>
              Rs. {product.price.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="product-weight" style={{ fontSize: '.75rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
            {product.weight && (
              <span className="product-weight" style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{product.weight}</span>
            )}
          </div>
        </Link>

        {showAddToCart && (
          <div style={{ marginTop: '.75rem' }}>
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              price={product.price}
            />
          </div>
        )}
      </div>
    </div>
  );
}
