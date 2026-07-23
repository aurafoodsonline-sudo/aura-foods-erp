import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryProductsPage({
  params,
}: CategoryProductsPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId: category.id },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="breadcrumbs" style={{ padding: '8rem 1.5rem 0', maxWidth: 1280, margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        <Link href="/categories" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Categories</Link>
        <span style={{ color: 'var(--muted)' }}>/</span>
        <span className="current" style={{ color: 'var(--ink)', fontWeight: 600 }}>{category.name}</span>
      </div>

      <section className="shop-header" style={{ padding: '3rem 1.5rem 3rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.9))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{category.name}</h1>
        {category.description && (
          <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>{category.description}</p>
        )}
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {products.length > 0 ? (
          <>
            <p style={{ fontSize: '.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} in this category
            </p>
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
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.5rem' }}>No products in this category yet</h3>
            <p style={{ color: 'var(--muted)' }}>Check back soon for new additions.</p>
            <Link href="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Browse all products</Link>
          </div>
        )}
      </section>
    </div>
  );
}
