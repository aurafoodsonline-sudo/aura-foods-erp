import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

interface BundlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function BundleDetailPage({ params }: BundlePageProps) {
  const { slug } = await params;

  const bundle = await prisma.bundle.findUnique({
    where: { slug },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, price: true, oldPrice: true, weight: true, tagline: true },
          },
        },
      },
    },
  });

  if (!bundle || !bundle.isActive) {
    notFound();
  }

  const productCount = bundle.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <div>
      <div className="breadcrumbs" style={{ padding: '8rem 1.5rem 0', maxWidth: 1280, margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        <Link href="/bundles" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Bundles</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        <span className="current" style={{ color: 'var(--ink)', fontWeight: 600 }}>{bundle.name}</span>
      </div>

      <div className="product-detail" style={{ padding: '3rem 1.5rem', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div style={{ borderRadius: 8, overflow: 'hidden' }}>
          {bundle.image ? (
            <img src={bundle.image} alt={bundle.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '4/3', background: 'rgba(10,10,10,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          )}
        </div>

        <div>
          <div className="bundle-label" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.25em', color: 'var(--gold)' }}>Bundle</div>
          <h1 className="product-name" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, marginTop: '.5rem' }}>{bundle.name}</h1>
          {bundle.tagline && (
            <p style={{ color: 'var(--muted)', marginTop: '.5rem', fontSize: '.9375rem' }}>{bundle.tagline}</p>
          )}

          <div className="product-detail-price" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--olive)', marginTop: '1rem' }}>
            {formatPrice(bundle.price)}
            {bundle.oldPrice > bundle.price && (
              <span style={{ fontSize: '1rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '.75rem', fontWeight: 400 }}>
                {formatPrice(bundle.oldPrice)}
              </span>
            )}
          </div>

          <p style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.25rem' }}>{productCount} item{productCount !== 1 ? 's' : ''} in this bundle</p>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '.75rem' }}>What&apos;s Included</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {bundle.items.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {item.quantity}x
                  </span>
                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${item.product.slug}`} style={{ fontSize: '.875rem', fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>
                      {item.product.name}
                    </Link>
                    {item.product.weight && (
                      <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.1rem' }}>{item.product.weight}</p>
                    )}
                  </div>
                  <span style={{ fontSize: '.8125rem', color: 'var(--muted)' }}>{formatPrice(item.product.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {bundle.description && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '.35rem' }}>About this Bundle</h3>
              <p style={{ fontSize: '.9375rem', color: 'var(--muted)', lineHeight: 1.7 }}>{bundle.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
