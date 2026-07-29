const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });
prisma.product.findMany({
  include: { images: true, category: true },
  orderBy: { name: 'asc' }
}).then(products => {
  console.log(JSON.stringify(products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.oldPrice,
    weight: p.weight,
    tagline: p.tagline,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    category: p.category?.name,
    images: p.images.map(i => ({ url: i.url, alt: i.alt }))
  })), null, 2));
  prisma.$disconnect();
}).catch(e => { console.error(e); prisma.$disconnect(); });
