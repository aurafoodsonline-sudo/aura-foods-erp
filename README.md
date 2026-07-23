# Aura Foods — E-Commerce & ERP Inventory System

A connected client-facing e-commerce website and internal ERP inventory management system for Aura Foods, a premium Pakistani spice brand.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (via Prisma ORM 7)
- **ORM:** Prisma with LibSQL adapter
- **Auth:** Custom session-based authentication with bcryptjs
- **Validation:** Zod
- **Charts:** Recharts
- **Icons:** Emoji / Unicode (no icon library dependency)

## Folder Structure

```
Aura Foods New/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Database seed script
│   └── dev.db              # SQLite database (auto-created)
├── public/
│   └── images/
│       ├── products/       # Product images
│       └── brand/          # Brand assets (logo, etc.)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── about/page.tsx             # About Aura Foods
│   │   ├── products/page.tsx          # Product listing
│   │   ├── products/[slug]/page.tsx   # Product detail
│   │   ├── categories/page.tsx        # Category listing
│   │   ├── categories/[slug]/page.tsx # Category products
│   │   ├── price-list/page.tsx        # Public price list
│   │   ├── cart/page.tsx              # Shopping cart
│   │   ├── checkout/page.tsx          # Checkout
│   │   ├── checkout/confirmation/page.tsx # Order confirmation
│   │   ├── contact/page.tsx           # Contact page
│   │   ├── admin/login/page.tsx       # Admin login
│   │   ├── admin/page.tsx             # Admin dashboard
│   │   ├── admin/products/...         # Product management
│   │   ├── admin/categories/...       # Category management
│   │   ├── admin/orders/...           # Order management
│   │   ├── admin/customers/...        # Customer management
│   │   ├── admin/inventory/...        # Inventory management
│   │   ├── admin/reports/...          # Reports
│   │   └── admin/settings/...         # Settings
│   ├── components/
│   │   ├── Navbar.tsx             # Public navbar
│   │   ├── Footer.tsx             # Public footer
│   │   ├── ProductCard.tsx        # Product card component
│   │   ├── CategoryCard.tsx       # Category card component
│   │   ├── AdminLayout.tsx        # Admin layout wrapper
│   │   ├── AdminSidebar.tsx       # Admin sidebar
│   │   ├── StatusBadge.tsx        # Order status badges
│   │   ├── EmptyState.tsx         # Empty state display
│   │   ├── LoadingSpinner.tsx     # Loading spinner
│   │   └── AddToCartButton.tsx    # Add to cart button
│   └── lib/
│       ├── prisma.ts             # Prisma client
│       ├── auth.ts               # Auth utilities
│       └── utils.ts              # Utility functions
├── .env.example
├── .env
├── package.json
├── prisma.config.ts
├── README.md
├── PROJECT_ANALYSIS.md
├── IMPLEMENTATION_PLAN.md
├── DATA_EXTRACTION_NOTES.md
├── ASSUMPTIONS.md
├── CHANGELOG.md
└── KNOWN_ISSUES.md
```

## Environment Variables

Copy `.env.example` to `.env` (already done):

```
DATABASE_URL="file:./prisma/dev.db"
```

## Install & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev

# Production build
npm run build
npm start

# Open Prisma Studio (database GUI)
npm run studio
```

## Default Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | admin@aurafoods.local | Admin@12345 |
| Admin | staff@aurafoods.local | Staff@12345 |
| Inventory Staff | inventory@aurafoods.local | Staff@12345 |
| Sales Staff | sales@aurafoods.local | Staff@12345 |

**Important:** Change default passwords in production.

## Products & Pricing

- 8 products seeded from the old Aura Foods catalog
- Prices in PKR (Rs.)
- Sourced from the provided `Aura_Foods_Price_List.xlsx` and old seed data
- Product images copied from old website assets (`/images/products/productXX.jpg`)
- Some image-to-product mapping is best-effort (documented in `DATA_EXTRACTION_NOTES.md`)

## What's Implemented

### Public Website
- Home page with hero, featured products, categories
- Product listing with search and category filter
- Product detail pages with images, descriptions
- Category listing and products by category
- Price list page
- Cart (localStorage-based) and checkout
- Contact page with form
- About page with brand story
- Responsive design, professional food brand styling

### Admin / ERP System
- Secure login with session-based auth
- Admin dashboard with stats, charts, low-stock alerts
- Product management (add, edit, deactivate)
- Category management (add, deactivate)
- Order management (list, view, update status)
- Customer management (list, view with order history)
- Inventory management (stock overview, stock in/out/adjustments)
- Inventory transaction history
- Reports (sales report with charts, inventory report)
- Settings page

### Features
- Order placement from public website flows to admin
- Stock changes create inventory transaction records
- Low-stock threshold alerts
- Order status workflow (Pending → Confirmed → Processing → Dispatched → Delivered / Cancelled)
- Printable order details
- Role-based user system (SuperAdmin, Admin, Inventory Staff, Sales Staff, Viewer)
- Real database-backed reports with date range filtering

## Known Limitations

See `KNOWN_ISSUES.md` for details.
- No payment gateway integration (manual/COD/inquiry checkout)
- Product images may not perfectly match (see `DATA_EXTRACTION_NOTES.md`)
- No CSV import/export
- No batch/expiry tracking
- No supplier/purchase order management
- No advanced role-based permissions (roles exist but UI restrictions are basic)

## License

Private — Aura Foods internal use.
