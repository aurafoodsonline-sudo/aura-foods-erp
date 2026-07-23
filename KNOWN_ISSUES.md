# Known Issues — Aura Foods E-Commerce & ERP System

## Current Issues

### 1. Product Images May Not Match
Product images from the old website (product01.jpg - product09.jpg) were copied to `/images/products/`. However, precise mapping between product and image is approximate. Some images from the original set (product10-18, WhatsApp images) are not assigned to any product.

### 2. No Image Upload in Admin
The admin product management pages don't include an image upload interface. Images must be manually placed in `public/images/products/` and referenced by path.

### 3. No Payment Gateway
Checkout collects customer information and creates an order record, but no payment processing is integrated. Orders are placed as inquiries/pending and require admin confirmation.

### 4. Limited Role-Based Permissions
User roles exist (SuperAdmin, Admin, InventoryStaff, SalesStaff, Viewer) but detailed per-action permission checking is not fully implemented across all admin pages. Basic route protection checks for authentication.

### 5. No Customer Accounts
Customers cannot register accounts, view order history, or track orders publicly. All order management is admin-side only.

### 6. Cart Uses localStorage
Cart data is stored in browser localStorage. It is not persisted to the server. Clearing browser data will lose cart contents.

### 7. No Email/Notification System
No email or SMS notifications are sent when orders are placed or statuses are updated.

### 8. No CSV Import/Export
Product, order, and inventory data cannot be imported or exported via CSV files.

## Missing Features (Future Work)

### Feature Priority

1. **Supplier Management** — Add, edit, and manage suppliers
2. **Purchase Orders** — Create purchase orders, receive stock
3. **Batch/Expiry Tracking** — Track inventory by batch number and expiry date
4. **Advanced Permissions** — Granular per-action permissions for each role
5. **Customer Login** — Customer accounts with order history tracking
6. **Payment Gateway** — Integrate with a payment provider (Stripe, JazzCash, etc.)
7. **CSV Import/Export** — Bulk product/order data management
8. **Email Notifications** — Automated order confirmation and status update emails
9. **Image Upload** — Dynamic image upload in admin product management
10. **Multi-warehouse** — Support for multiple warehouse locations
