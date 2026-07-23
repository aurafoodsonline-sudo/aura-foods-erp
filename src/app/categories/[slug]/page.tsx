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
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-gold transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/products/hero-spices.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-300 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {products.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {products.length} product{products.length !== 1 ? "s" : ""} in this
              category
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No products in this category yet
            </h3>
            <p className="text-sm text-gray-500">
              Check back soon for new additions.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm text-gold hover:text-gold-light font-medium"
            >
              Browse all products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
