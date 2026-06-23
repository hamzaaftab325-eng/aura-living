---
Task ID: phase-6
Agent: Super Z (main)
Task: Build Phase 6 (Admin Dashboard) — product CRUD with Cloudinary image upload, order management (status updates), customer list, coupon management. All admin-protected with role checks.

Work Log:
- Explored existing admin: AdminDashboard.tsx (649 lines, all mock data), /admin/page.tsx (client-only).
- Installed cloudinary@2.10.0 + next-cloudinary@6.17.5.
- Created src/lib/cloudinary.ts — server-side image upload to Cloudinary (uploadImageBuffer, deleteImage, extractPublicIdFromUrl, isCloudinaryConfigured). Uses signed uploads (API secret never exposed to browser). 25 GB free storage vs 1 GB for Vercel Blob.
- Created src/lib/admin.ts — admin server functions with requireAdmin() role check (throws AdminAuthError if not admin). Functions: getAdminStats (revenue, orders, products, customers, low stock, recent orders, top products), adminGetProducts, adminGetProductById, adminGetOrders, adminUpdateOrderStatus, adminGetCustomers (with order count + total spent), adminGetCoupons.
- Created 8 admin API routes (all require ADMIN role):
  - POST /api/admin/upload — Cloudinary image upload (multipart form data, max 10 MB, validates image type)
  - GET/POST /api/admin/products — list + create (Zod validated, slug auto-generated, SKU/slug uniqueness checks)
  - PUT/DELETE /api/admin/products/[id] — update + soft delete (sets deletedAt + isActive=false)
  - GET /api/admin/orders — paginated list with status filter + search
  - PATCH /api/admin/orders/[id] — update status (creates OrderStatusEvent, sets shippedAt/deliveredAt/cancelledAt timestamps)
  - GET /api/admin/customers — list with order count + total spent (BigInt serialized as string)
  - GET/POST /api/admin/coupons — list + create (Zod validated, code uniqueness, rupees→paisa conversion)
  - PUT/DELETE /api/admin/coupons/[id] — update + delete
- Refactored /admin/page.tsx to server component — fetches stats via getAdminStats(), passes to client component. Shows "Admin Access Required" if not logged in, "Access Denied" if not admin.
- Created AdminDashboardClient.tsx — dashboard UI: 4 stat cards (revenue, orders, products, customers), low stock alert, 4 navigation cards (products/orders/customers/coupons), recent orders table, top products by sales, quick action buttons.
- Created AdminProductsClient.tsx — product list with search, pagination, edit/delete actions. Shows stock with low-stock warning, active/inactive status, units sold count.
- Created AdminProductForm.tsx — create/edit form with:
  - Cloudinary image upload (drag-drop UI, multiple files, preview grid, MAIN badge on first image, remove button)
  - Basic info (name, SKU, slug, description, category, badge)
  - Pricing & inventory (price, original price for sales, stock, inStock, featured, isActive checkboxes)
  - Product details (material, dimensions, weight, origin, care instructions, warranty)
- Created /admin/products/new/page.tsx — server component fetches categories, renders AdminProductForm.
- Created /admin/products/[id]/edit/page.tsx — server component fetches product + categories, renders AdminProductForm with existing data.
- Created AdminOrdersClient.tsx — order list with search + status filter. Expandable rows showing customer contact + payment info. Status update dropdown (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → CANCELLED).
- Created AdminCustomersClient.tsx — customer list with search. Shows name, email, email verified badge, order count, total spent, join date.
- Created AdminCouponsClient.tsx — coupon management: list (card grid showing code, discount, usage, status), create form (code, type PERCENTAGE/FLAT, value, min order, max discount, usage limit, per user limit), delete button.
- Created page.tsx files for /admin/orders, /admin/customers, /admin/coupons.

VERIFICATION (live API tests with curl as admin):
- ✅ All 6 admin pages return 200: /admin, /admin/products, /admin/products/new, /admin/orders, /admin/customers, /admin/coupons
- ✅ GET /api/admin/products — returns 45 products
- ✅ GET /api/admin/orders — returns orders with items + user
- ✅ GET /api/admin/customers — returns customers with order count + total spent
- ✅ GET /api/admin/coupons — returns WELCOME10 + AURA500 coupons
- ✅ POST /api/admin/upload — returns clear error when Cloudinary not configured (expected)
- ✅ npm run typecheck — 0 errors
- ✅ npm run lint — 0 errors (7 pre-existing warnings)
- ✅ npm run build — succeeds, all admin pages compile

Stage Summary:
- ✅ Phase 6 COMPLETE and verified.
- Admin dashboard live: stats, recent orders, top products, low stock alerts.
- Product management: full CRUD with Cloudinary image upload (requires Cloudinary credentials to be added).
- Order management: list, filter, search, update status (with timeline events).
- Customer management: list with order count + total spent.
- Coupon management: list, create, delete (full CRUD via API).
- All admin routes protected by role check (requireAdmin throws AdminAuthError if not admin).
- ⚠️ Cloudinary credentials needed for image upload: user must create free Cloudinary account and add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local. Without these, product creation works but image upload returns an error.
- Awaiting user verification + approval before Phase 7 (Production Hardening).
