import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  let relatedProducts: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    oldPrice: number;
    weight: string;
    tagline: string;
    images: { url: string; alt: string }[];
  }> = [];
  if (product.categoryId) {
    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      take: 4,
    });
    relatedProducts = related.map((rp: any) => ({
      id: rp.id,
      name: rp.name,
      slug: rp.slug,
      price: rp.price,
      oldPrice: rp.oldPrice,
      weight: rp.weight,
      tagline: rp.tagline,
      images: rp.images.map((img: any) => ({ url: img.url, alt: img.alt })),
    }));
  }

  const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ padding: '8rem 1.5rem 0', maxWidth: 1280, margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        <Link href="/products" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Shop</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{product.category.name}</Link>
            <span style={{ color: 'var(--muted)' }}>/</span>
          </>
        )}
        <span className="current" style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="product-detail" style={{ padding: '3rem 1.5rem', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div className="product-gallery" style={{ borderRadius: 8, overflow: 'hidden' }}>
          {primaryImage ? (
            <img src={primaryImage.url} alt={primaryImage.alt || product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(10,10,10,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          {product.category && (
            <Link href={`/products?category=${product.category.slug}`} style={{ fontSize: '.8125rem', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {product.category.name}
            </Link>
          )}

          <div className="product-name" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, marginTop: '.5rem' }}>
            {product.name}
          </div>

          {product.tagline && (
            <p style={{ color: 'var(--muted)', marginTop: '.5rem', fontSize: '.9375rem' }}>{product.tagline}</p>
          )}

          <div className="product-detail-price" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--olive)', marginTop: '1rem' }}>
            Rs. {product.price.toLocaleString()}
            {product.oldPrice > product.price && (
              <span style={{ fontSize: '1rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '.75rem', fontWeight: 400 }}>
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.weight && (
            <p style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.25rem' }}>{product.weight}</p>
          )}

          <p className="product-detail-desc" style={{ lineHeight: 1.8, color: 'var(--muted)', marginTop: '1.5rem', fontSize: '.9375rem' }}>
            {product.description}
          </p>

          {product.ingredients && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Ingredients</h3>
              <p style={{ color: 'var(--muted)', marginTop: '.35rem', fontSize: '.9375rem' }}>{product.ingredients}</p>
            </div>
          )}

          {product.usage && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>How to Use</h3>
              <p style={{ color: 'var(--muted)', marginTop: '.35rem', fontSize: '.9375rem' }}>{product.usage}</p>
            </div>
          )}

          <div className="product-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '2rem' }}>
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              price={product.price}
              className="btn-primary"
            />
            <a href="https://wa.me/923352832967?text=Hi%2C%20I%20want%20to%20order%20{product.name}" target="_blank" rel="noopener" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.875rem 2rem', borderRadius: 9999, fontSize: '.875rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(10,10,10,0.2)', color: 'var(--ink)', background: 'transparent' }}>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section" style={{ padding: '5rem 1.5rem', maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
            <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>You May Also Like</div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Related Products</h2>
          </div>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {relatedProducts.map((rp) => (
              <ProductCard
                key={rp.id}
                product={{
                  id: rp.id,
                  name: rp.name,
                  slug: rp.slug,
                  price: rp.price,
                  oldPrice: rp.oldPrice || null,
                  weight: rp.weight || null,
                  tagline: rp.tagline || null,
                  images: rp.images.map((img) => ({ url: img.url, alt: img.alt })),
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
