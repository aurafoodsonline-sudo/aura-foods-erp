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
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url;
  const imageAlt = product.images?.[0]?.alt || product.name;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.tagline && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.tagline}</p>
        )}

        {product.weight && (
          <p className="text-xs text-gray-400 mt-1">{product.weight}</p>
        )}

        <div className="mt-auto pt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-700">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-3">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            price={product.price}
          />
        </div>
      </div>
    </div>
  );
}
