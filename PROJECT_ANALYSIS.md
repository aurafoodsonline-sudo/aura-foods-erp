# Project Analysis — Aura Foods E-Commerce & ERP System

## Folder Structure Findings

### Root: `D:\!Aura Foods\`
- `Aura foods New/` — Empty target directory (now populated with new project)
- `OLd website and erp marerial/` — Contains old website + ERP reference
- `photoes,website structure and pricelist/` — Photos, website structure, price list

### Reference Files Found

**Old Website (`OLd website and erp marerial/aura-foods-website/`):**
- Django-based e-commerce site (Python/Django)
- SQLite database with products, categories, orders
- Static assets including product images (18 product photos)
- Template files for all pages (index, about, shop, product, cart, checkout, etc.)
- Seed script with 8 products, 6 categories, testimonials, bundles
- Admin dashboard template (Django admin style)

**Combined ERP Reference (`OLd website and erp marerial/!! Combined_ClientFacingEcom-&-ERP-Inventory&Packaging_Version3.zip` - extracted to temp):**
- Full Django-based combined e-commerce and ERP system
- Models: Product, ProductVariant, ProductBatch, Category, Order, OrderItem, Customer, StockLedger
- ERP models: Company, Warehouse, UnitOfMeasure, Product (extended), Supplier, PurchaseOrder, etc.
- 2,500+ line models.py, comprehensive seed data
- Templates for admin dashboard, commerce console
- Sales app with invoice management
- CRM app with interaction tracking
- Design system documentation

**Photos & Price List (`photoes,website structure and pricelist/`):**
- `Aura_Foods_Price_List.xlsx` — Price list with 13 products and 4 pack sizes (100g, 250g, 500g, 1000g)
- `Aura_Foods_Price_List.pdf.pdf` — Same price list in PDF format
- `Website Structure.docx` — Website structure document
- 30+ WhatsApp images (product photos)
- Gemini-generated images (logo/hero concepts)
- 1 screenshot

## Price List Format

Excel file with a single sheet "Spice Price List":
- Columns: Product, 100g, 250g, 500g, 1000g
- 13 products with pricing per pack size
- Prices in PKR
- Products: Lal Mirch Powder, Kashmiri Lal Mirch Powder, Kuti Mirch (Coarse), Sabut Lal Mirch, Sabut Degi/Kashmiri Mirch, Haldee Powder, Dhaniya Powder, Dhaniya Sabut, Zeera Sabut, Tang Chaat Masala, Garam Masala Powder, Rock Salt, Pink Salt

## Product Structure Found

Old website had:
- 6 categories: Red Chili Powder, Turmeric Powder, Coriander Powder, Garam Masala, Premium Blends, Salt Range
- 8 products with names, prices, weights, descriptions, ingredients, usage notes
- Product images stored as product01.jpg through product18.jpg

## ERP Reference Findings

The combined ERP reference is a sophisticated Django-based system with:
- Full product lifecycle management (raw materials → powder → finished SKU → packaging)
- Multi-company, multi-warehouse support
- Batch/expiry tracking
- Purchase order management
- Sales invoicing
- CRM
- Inventory valuation with FIFO
- Role-based permissions
- The old "aurafoods_erp" folder is just a partial Django settings reference

## Chosen Tech Stack

- Next.js 16 App Router (fresh, modern framework)
- React 19 + TypeScript
- Tailwind CSS v4
- Prisma ORM 7 with SQLite (LibSQL adapter)
- bcryptjs for password hashing
- Recharts for charts
- Zod for validation (declared but minimal usage in current version)
- Custom session-based authentication (cookies)

## Build Plan

The project was built in phases:
1. Inspection and documentation
2. App setup (Next.js, Prisma, dependencies)
3. Database schema design
4. Seed script creation
5. Reusable UI components
6. Public website pages
7. Admin/ERP pages
8. API routes
9. Validation and testing
