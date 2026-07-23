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

  return (
    <div>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/products/hero.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Our Products</h1>
          <p className="mt-2 text-gray-300">
            Discover our range of premium, organic spices.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-100 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        !categorySlug
                          ? "bg-gold text-black"
                          : "text-gray-400 hover:bg-gray-800"
                      }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-gold text-black"
                          : "text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-gray-500">
                {products.length} product{products.length !== 1 ? "s" : ""} found
                {categorySlug && (
                  <>
                    {" in "}
                    <span className="font-medium text-gray-700">
                      {categories.find((c: any) => c.slug === categorySlug)?.name}
                    </span>
                  </>
                )}
                {q && (
                  <>
                    {" for "}
                    <span className="font-medium text-gray-700">&ldquo;{q}&rdquo;</span>
                  </>
                )}
              </p>
              <form method="GET" action="/products" className="flex w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q || ""}
                    placeholder="Search products..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-block text-sm text-gold hover:text-gold-light font-medium"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
