import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <section className="shop-header" style={{ padding: '8rem 1.5rem 3rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.9))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Our Categories</h1>
        <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>Explore our range of premium spice categories, each crafted with care.</p>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {categories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {categories.map((category: any) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                  image: category.image || null,
                  description: category.description || null,
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.5rem' }}>No categories yet</h3>
            <p style={{ color: 'var(--muted)' }}>Categories will appear here once they are added.</p>
          </div>
        )}
      </section>
    </div>
  );
}
