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
      <section className="shop-header" style={{ padding: '8rem 1.5rem 3rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.9))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Price List</h1>
        <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Complete price list of all our products. Updated regularly.
        </p>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <p style={{ fontSize: '.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
          Showing {totalProducts} product{totalProducts !== 1 ? 's' : ''} across {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
        </p>

        {categories.map((category: any) =>
          category.products.length > 0 ? (
            <div key={category.id} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ width: 4, height: 20, background: 'var(--gold)', borderRadius: 2, display: 'inline-block' }} />
                {category.name}
              </h2>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', fontSize: '.875rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(10,10,10,0.03)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '.75rem 1rem', fontWeight: 600, color: 'var(--muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Product Name</th>
                      <th style={{ textAlign: 'left', padding: '.75rem 1rem', fontWeight: 600, color: 'var(--muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Weight</th>
                      <th style={{ textAlign: 'right', padding: '.75rem 1rem', fontWeight: 600, color: 'var(--muted)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderCollapse: 'collapse' }}>
                    {category.products.map((product: any, idx: number) => (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--card)' : 'rgba(10,10,10,0.02)' }}>
                        <td style={{ padding: '.75rem 1rem', fontWeight: 500 }}>{product.name}</td>
                        <td style={{ padding: '.75rem 1rem', color: 'var(--muted)' }}>{product.weight || '-'}</td>
                        <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--olive)' }}>Rs. {product.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <PrintButton />
        </div>
      </section>
    </div>
  );
}
