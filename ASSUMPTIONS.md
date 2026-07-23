# Assumptions — Aura Foods E-Commerce & ERP System

## Business Assumptions

1. **Currency:** All prices are in Pakistani Rupees (PKR/Rs.) unless otherwise specified in the price list.

2. **Retail vs. Wholesale:** The XLSX price list contains wholesale/bulk pricing by weight (100g-1000g), while the old website sold retail 100g-200g packs at fixed prices. We used the retail prices from the old seed data.

3. **Product Catalog:** The 8 products from the old website seed data represent the current retail catalog. Additional products from the XLSX price list (Kashmiri Lal Mirch, Zeera Sabut, etc.) were not included as they lacked confirmed retail pricing and descriptions.

4. **Order Flow:** Since no payment gateway details were provided, checkout uses a manual/COD/inquiry model. Orders are created and await admin confirmation.

5. **Customer Accounts:** No customer login/account system was implemented. Customers provide contact info at checkout and orders are tracked by order number and phone.

6. **Delivery:** Delivery charges are set at a flat rate (Rs. 40) with free shipping over Rs. 500 (configurable in settings).

## Technical Assumptions

7. **Prisma 7 Compatibility:** Prisma v7 requires driver adapters. We used `@prisma/adapter-libsql` with SQLite. For PostgreSQL migration, the adapter would need to change to `@prisma/adapter-pg`.

8. **Database File Location:** The SQLite database file is at `./prisma/dev.db`. The `DATABASE_URL` in `.env` is `file:./prisma/dev.db`.

9. **Image Serving:** Product images are served from `/images/products/` (static folder). No dynamic image upload was implemented for MVP.

10. **Auth Approach:** Custom session-based auth using httpOnly cookies was chosen over NextAuth.js for simplicity. Sessions last 7 days.

## Data Assumptions

11. **Product-Image Mapping:** Product images from the old website are mapped approximately. Some images may not match the correct product.

12. **Price List Authority:** The old website seed data prices were used as the primary source since they had confirmed product names and descriptions matching the Aura Foods brand.

13. **Seed Data:** The seed script creates realistic but synthetic customers and orders for demo purposes.

14. **Reports:** Dashboard statistics show real database-backed data. If no order data exists, empty states are shown.

## Limitations Accepted

15. No payment gateway integration (manual/inquiry checkout)
16. No customer login/registration
17. No CSV import/export for products or orders
18. No batch/expiry date tracking for inventory
19. No supplier/purchase order management
20. No email notifications
21. No image upload interface (images must be placed in public folder manually)
22. Advanced role-based permissions exist as a role field but detailed per-action permissions are not implemented
