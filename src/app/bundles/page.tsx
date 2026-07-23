import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="shop-header" style={{ padding: '8rem 1.5rem 3rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.9))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Value Bundles</h1>
        <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Curated spice bundles for every kitchen — save more when you buy together.
        </p>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {bundles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.5rem' }}>No bundles yet</h3>
            <p style={{ color: 'var(--muted)' }}>Check back soon for exciting bundle deals.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {bundles.map((bundle: any) => (
              <Link key={bundle.id} href={`/bundles/${bundle.slug}`} className="bundle-card" style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: 8, padding: '2rem', position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'all .3s' }}>
                {bundle.oldPrice > bundle.price && (
                  <span className="bundle-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '.625rem', textTransform: 'uppercase', letterSpacing: '.15em', background: 'linear-gradient(135deg, var(--gold), #d4b85a)', color: 'var(--ink)', padding: '.35rem .75rem', borderRadius: 9999, fontWeight: 700 }}>
                    Save {Math.round((1 - bundle.price / bundle.oldPrice) * 100)}%
                  </span>
                )}
                <div className="bundle-label" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.25em', color: 'var(--gold)' }}>Bundle</div>
                <h3 className="bundle-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginTop: '.75rem' }}>{bundle.name}</h3>
                {bundle.tagline && (
                  <p className="bundle-items" style={{ fontSize: '.875rem', opacity: .65, marginTop: '.5rem' }}>{bundle.tagline}</p>
                )}
                <p style={{ fontSize: '.75rem', opacity: .5, marginTop: '.25rem' }}>{bundle._count.items} items</p>
                <div className="bundle-price-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '.75rem', marginTop: '2rem' }}>
                  <span className="bundle-price" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem' }}>{formatPrice(bundle.price)}</span>
                  {bundle.oldPrice > bundle.price && (
                    <span className="bundle-old" style={{ fontSize: '.8125rem', opacity: .4, textDecoration: 'line-through', marginBottom: '.15rem' }}>{formatPrice(bundle.oldPrice)}</span>
                  )}
                </div>
                <span className="bundle-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: 'var(--gold)', fontSize: '.875rem', fontWeight: 600, textDecoration: 'none', marginTop: '1.5rem', transition: 'gap .3s' }}>
                  View Bundle →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
