import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/PrintButton";

export default async function PriceListPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const totalProducts = categories.reduce(
    (sum: number, cat: any) => sum + cat.products.length,
    0
  );

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Price List</h1>
          <p className="mt-2 text-gray-300">
            Complete price list of all our products. Updated regularly.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <p className="text-sm text-gray-500 mb-6">
          Showing {totalProducts} product{totalProducts !== 1 ? "s" : ""} across{" "}
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
        </p>

        {categories.map((category: any) =>
          category.products.length > 0 ? (
            <div key={category.id} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-gold rounded-full" />
                {category.name}
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Product Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Weight
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.products.map((product: any, idx: number) => (
                      <tr
                        key={product.id}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }                          hover:bg-gray-800 transition-colors`}
                      >
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {product.weight || "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gold">
                          Rs. {product.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null
        )}

        {/* Print Button */}
        <div className="text-center mt-8 print:hidden">
          <PrintButton />
        </div>
      </section>
    </div>
  );
}