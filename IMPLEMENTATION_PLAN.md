# Implementation Plan — Aura Foods E-Commerce & ERP System

## Implementation Priority (as executed)

1. ✓ **Folder inspection and documentation** — All reference folders inspected, contents documented
2. ✓ **Clean app setup** — Next.js 16 + TypeScript + Tailwind + Prisma 7 + SQLite
3. ✓ **Product/catalog data extraction** — Price list extracted from XLSX, products from old seed data
4. ✓ **Public product catalog** — Home, products, categories, search, filtering, product detail
5. ✓ **Cart/order placement** — localStorage cart, checkout form, order creation API
6. ✓ **Admin login** — Session-based auth with bcrypt password hashing
7. ✓ **Admin order management** — Order list, detail, status updates, customer info
8. ✓ **Product management** — Add, edit, deactivate products with categories and images
9. ✓ **Inventory stock management** — Stock overview, low-stock filtering, stock in/out/adjustment
10. ✓ **Stock movement history** — Inventory transaction records with product/user tracking
11. ✓ **Low-stock alerts** — Threshold-based alerts on dashboard and inventory page
12. ✓ **Basic dashboard** — Stats cards, sales chart, recent orders, low-stock alerts
13. ✓ **Basic reports** — Sales report with chart, inventory report with valuation
14. ✗ **Suppliers/purchases** — Not implemented (documented as future work)
15. ✗ **Advanced roles/permissions** — Basic role field exists, detailed permissions not implemented
16. ✗ **CSV import/export** — Not implemented
17. ✗ **Batch/expiry support** — Not implemented (documented as future work)

## Routes Implemented

### Public Website
- `/` — Home page
- `/about` — About Aura Foods
- `/products` — Product listing with search & category filter
- `/products/[slug]` — Product detail
- `/categories` — Category listing
- `/categories/[slug]` — Category products
- `/price-list` — Price list table
- `/cart` — Cart management
- `/checkout` — Checkout form
- `/checkout/confirmation` — Order confirmation
- `/contact` — Contact page

### Admin / ERP
- `/admin/login` — Admin login
- `/admin` — Dashboard
- `/admin/products` — Product management
- `/admin/products/new` — Add product
- `/admin/products/[id]` — Edit product
- `/admin/categories` — Category management
- `/admin/orders` — Order list
- `/admin/orders/[id]` — Order detail
- `/admin/customers` — Customer list
- `/admin/customers/[id]` — Customer detail
- `/admin/inventory` — Stock overview & adjustments
- `/admin/inventory/transactions` — Stock movement history
- `/admin/reports` — Reports overview
- `/admin/reports/sales` — Sales report
- `/admin/reports/inventory` — Inventory report
- `/admin/settings` — Basic settings

### API Routes
- `/api/products/by-ids` — Bulk product fetch (for cart)
- `/api/orders` — Create order (public)
- `/api/contact` — Submit contact form
- `/api/admin/login` — Admin authentication
- `/api/admin/logout` — Session destroy
- `/api/admin/me` — Current user info
- `/api/admin/dashboard` — Dashboard statistics
- `/api/admin/products` — Product CRUD
- `/api/admin/products/[id]` — Single product CRUD
- `/api/admin/categories` — Category CRUD
- `/api/admin/categories/[id]` — Single category CRUD
- `/api/admin/orders` — Order listing
- `/api/admin/orders/[id]` — Single order CRUD
- `/api/admin/customers` — Customer listing
- `/api/admin/customers/[id]` — Single customer detail
- `/api/admin/inventory` — Stock listing & adjustments
- `/api/admin/inventory/transactions` — Transaction history
- `/api/admin/reports` — General reports
- `/api/admin/reports/sales` — Sales report
- `/api/admin/reports/inventory` — Inventory report
- `/api/admin/settings` — Settings management
