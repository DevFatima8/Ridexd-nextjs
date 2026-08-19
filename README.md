# Ridexd.com — Full Ecommerce Store + Shopify-style Admin (Next.js)

A complete, production-ready ecommerce storefront and admin panel for **Ridexd.com**, built with
Next.js 16 (App Router), Tailwind CSS v4 and Drizzle ORM.

**Departments (5) × Categories (5) = 25 collections, 100 seeded products**

| Department | Categories |
| ---------- | ---------- |
| **Women** | Stitched · Unstitched · Luxury Pret · Kurta Sets · Shawls & Dupattas |
| **Men** | Stitched · Unstitched · Elegant · Kurta & Shalwar · Waistcoats & Sherwani |
| **Kids** | Boys · Girls · Baby · Eastern Sets · Sleepwear & School |
| **Bed** | Bed Sheets · Quilts & Comforters · Duvet Covers · Pillows & Cushions · Mattress Protectors |
| **Bath** | Towels · Bathrobes · Bath Mats · Shower Curtains · Bath Sets & Accessories |

## Storefront pages

1. `/` — hero, departments, featured products, category-wise browsing, new arrivals, bed & bath editorial
2. `/shop` — full catalogue with department / category / search / sort filters + pagination
3. `/collections` and `/collections/[group]` — collection landing pages (women, men, kids, bed, bath)
4. `/product/[slug]` — gallery, size selector, quantity, add-to-bag / buy-now, details, delivery, related items
5. `/cart` — full bag page with quantity control and order summary
6. `/checkout` — customer + address + payment method, creates a real order in the database
7. `/about`, `/contact`, `/track` — content, support and order tracking

The cart is stored in `localStorage` (CartProvider + slide-out drawer) so it survives reloads.

## Admin panel (Shopify-style)

URL: **`/admin`** → password login (`ADMIN_PASSWORD`, default `ridexd2026`).

* `/admin` — dashboard: revenue, orders to fulfil, product count, inventory value, recent orders, department breakdown
* `/admin/products` — table with search, department/status filters, pagination, duplicate + delete row actions
* `/admin/products/new` and `/admin/products/[id]` — full product CRUD form (media URLs, sizes, pricing, inventory, organisation, status, featured)
* `/admin/orders` + `/admin/orders/[id]` — order pipeline tabs (pending → confirmed → packed → shipped → delivered / cancelled) with inline status updates and line-item detail
* `/admin/categories` — all 25 categories with live product counts
* `/admin/customers` — customers aggregated from orders with spend

REST API (also usable from any external client):

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/health` | health probe |
| GET / POST | `/api/products` | list (filters, paging) / create (admin) |
| GET / PATCH / DELETE | `/api/products/[id]` | read / update / delete (admin) |
| POST | `/api/orders` | checkout |
| GET | `/api/orders` | list orders (admin) |
| GET / PATCH | `/api/orders/[id]` | order detail / update status (admin) |
| POST / DELETE | `/api/admin/session` | admin login / logout |

## Database

* Sandboxed preview uses PostgreSQL through Drizzle (`src/db/schema.ts`, `DATABASE_URL` in `.env`).
* The catalogue self-seeds on first request: 25 categories + 100 products (`src/lib/seed-data.ts`).
* **MySQL for Hostinger** is ready to go:
  * `mysql/schema.sql` — import in Hostinger phpMyAdmin to create `categories`, `products`, `orders`, `order_items`.
  * `mysql/schema.mysql.ts` — drop-in Drizzle `mysql-core` schema + switch-over instructions.

## Switching to MySQL on Hostinger

```bash
npm install mysql2
cp mysql/schema.mysql.ts src/db/schema.ts   # or copy the file contents
# then swap src/db/index.ts to the mysql2 driver (see header comment in mysql/schema.mysql.ts)
# .env
DATABASE_URL="mysql://u123456789_user:password@127.0.0.1:3306/u123456789_ridexd"
ADMIN_PASSWORD="your-strong-password"
ADMIN_SECRET="any-long-random-string"
npx drizzle-kit push    # or import mysql/schema.sql in phpMyAdmin
npm run build && npm start
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
