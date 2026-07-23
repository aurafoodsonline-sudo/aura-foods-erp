import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q, category: categorySlug } = await searchParams;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const where: Record<string, unknown> = { isActive: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { tagline: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const activeCategory = categorySlug ? categories.find((c: any) => c.slug === categorySlug) : null;

  return (
    <div>
      {/* Shop Header */}
      <section className="shop-header" style={{ padding: '8rem 1.5rem 3rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.9))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          {categorySlug ? `${activeCategory?.name || categorySlug} Spices — Buy Online in Pakistan` : 'Organic Spice Collection — Buy Online in Pakistan'}
        </h1>
        <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          {categorySlug ? `Browse our selection of premium ${categorySlug} spices. Hand-sourced, stone-ground, and delivered across Pakistan.` : 'Every spice tells a story of Pakistani heritage. Hand-sourced, stone-ground, and packed with pride.'}
        </p>
      </section>

      <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Sidebar */}
        <aside className="shop-sidebar" style={{ padding: 0 }} aria-label="Filter by spice category">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', marginBottom: '1rem' }}>Categories</h3>
          <nav className="shop-categories" style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <Link
              href="/products"
              className={!categorySlug ? 'active' : ''}
              style={{ display: 'block', padding: '.5rem .75rem', borderRadius: 8, textDecoration: 'none', fontSize: '.875rem', transition: 'all .2s', whiteSpace: 'nowrap', background: !categorySlug ? 'var(--gold)' : 'transparent', color: !categorySlug ? 'var(--ink)' : 'var(--muted)', fontWeight: !categorySlug ? 600 : 400 }}
            >
              All Products
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={categorySlug === cat.slug ? 'active' : ''}
                style={{ display: 'block', padding: '.5rem .75rem', borderRadius: 8, textDecoration: 'none', fontSize: '.875rem', transition: 'all .2s', whiteSpace: 'nowrap', background: categorySlug === cat.slug ? 'var(--gold)' : 'transparent', color: categorySlug === cat.slug ? 'var(--ink)' : 'var(--muted)', fontWeight: categorySlug === cat.slug ? 600 : 400 }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '.875rem', color: 'var(--muted)' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
              {activeCategory && <> in <strong>{activeCategory.name}</strong></>}
              {q && <> for &ldquo;{q}&rdquo;</>}
            </p>
            <form method="GET" action="/products">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="q"
                  defaultValue={q || ''}
                  placeholder="Search products..."
                  style={{ padding: '.5rem 2.25rem .5rem .75rem', borderRadius: 8, border: '1px solid var(--border)', fontSize: '.875rem', fontFamily: 'inherit', background: 'var(--card)', minWidth: 200 }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
            </form>
          </div>

          {products.length > 0 ? (
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    oldPrice: product.oldPrice || null,
                    weight: product.weight || null,
                    tagline: product.tagline || null,
                    images: product.images.map((img: any) => ({
                      url: img.url,
                      alt: img.alt,
                    })),
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.5rem' }}>No products found</h3>
              <p style={{ fontSize: '.875rem', color: 'var(--muted)' }}>Try adjusting your search or filter criteria.</p>
              <Link href="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Clear all filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
