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
    <Link href={`/categories/${category.slug}`} className="block group">
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4 text-center">
          <h3 className="text-base font-semibold text-gray-100 group-hover:text-gold transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
