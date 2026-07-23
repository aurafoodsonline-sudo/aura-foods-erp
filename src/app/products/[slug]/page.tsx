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
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-gold transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-gold font-medium hover:text-gold-light mb-2"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="mt-2 text-lg text-gray-500">{product.tagline}</p>
            )}

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gold">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.weight && (
              <p className="mt-2 text-sm text-gray-500">Weight: {product.weight}</p>
            )}

            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                price={product.price}
              />
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.ingredients && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h2>
                <p className="text-gray-600 leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.usage && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h2>
                <p className="text-gray-600 leading-relaxed">{product.usage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          </div>
        </section>
      )}
    </div>
  );
}
