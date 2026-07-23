import Link from 'next/link';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="category-card" style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 8, overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'var(--cream)' }}>
      <img
        src={category.image || '/images/products/placeholder.jpg'}
        alt={category.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s' }}
      />
      <div className="category-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 60%, transparent 100%)' }} />
      <div className="category-name" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>{category.name}</h3>
        {category.description && (
          <span style={{ fontSize: '.75rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '.35rem', marginTop: '.25rem', transition: 'gap .3s' }}>
            {category.description}
          </span>
        )}
      </div>
    </Link>
  );
}
