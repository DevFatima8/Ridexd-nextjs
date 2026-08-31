import { and, asc, count, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, contactMessages, orderItems, orders, productReviews, products } from "@/db/schema";
import type { ContactMessageRow, NewProductReviewRow, NewProductRow, OrderItemRow, OrderRow, ProductReviewRow, ProductRow } from "@/db/schema";
import type { AnyColumn } from "drizzle-orm";
import { CATEGORIES } from "./catalog";
import { SEED_PRODUCTS } from "./seed-data";

const FALLBACK_PRODUCTS: ProductRow[] = SEED_PRODUCTS.map((p, i) => ({
  id: i + 1,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  description: p.description,
  groupSlug: p.groupSlug,
  categorySlug: p.categorySlug,
  subcategorySlug: p.subcategorySlug ?? "",
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  cost: p.cost,
  sku: p.sku,
  barcode: "",
  stock: p.stock,
  sizes: p.sizes,
  images: p.images,
  fabric: p.fabric,
  colorFamily: p.colorFamily,
  status: p.status,
  featured: p.featured,
  vendor: p.vendor,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

function getFallbackProducts(filters: ProductFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(60, Math.max(4, filters.pageSize ?? 12));

  let items = [...FALLBACK_PRODUCTS];

  if (filters.status && filters.status !== "all") {
    items = items.filter((p) => p.status === filters.status);
  }
  if (filters.group && filters.group !== "all") {
    items = items.filter((p) => p.groupSlug === filters.group);
  }
  if (filters.category && filters.category !== "all") {
    items = items.filter(
      (p) =>
        p.categorySlug === filters.category ||
        p.subcategorySlug === filters.category ||
        p.subcategorySlug.startsWith(`${filters.category}-`),
    );
  }
  if (filters.subcategory && filters.subcategory !== "all") {
    items = items.filter((p) => p.subcategorySlug === filters.subcategory);
  }
  if (filters.featured) {
    items = items.filter((p) => p.featured);
  }
  if (typeof filters.minPrice === "number" && !Number.isNaN(filters.minPrice)) {
    items = items.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number" && !Number.isNaN(filters.maxPrice)) {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.colorFamily.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "title":
      items.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "stock":
      items.sort((a, b) => b.stock - a.stock);
      break;
    case "oldest":
      items.sort((a, b) => a.id - b.id);
      break;
    default:
      items.sort((a, b) => b.id - a.id);
      break;
  }

  const total = items.length;
  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

  return {
    items: pagedItems,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

function getFallbackCategories(group?: string): CategoryWithCount[] {
  return CATEGORIES.filter((c) => !group || c.group === group).map((c, i) => {
    let count = 0;
    if (c.parentSlug) {
      count = FALLBACK_PRODUCTS.filter(
        (p) => p.groupSlug === c.group && p.subcategorySlug === c.slug,
      ).length;
    } else {
      count = FALLBACK_PRODUCTS.filter(
        (p) =>
          p.groupSlug === c.group &&
          (p.categorySlug === c.slug || p.subcategorySlug.startsWith(`${c.slug}-`)),
      ).length;
    }
    return {
      id: i + 1,
      groupSlug: c.group,
      parentSlug: c.parentSlug ?? "",
      categorySlug: c.slug,
      name: c.name,
      tagline: c.tagline,
      image: c.image,
      productCount: count,
    };
  });
}

function getFallbackGroupCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  FALLBACK_PRODUCTS.forEach((p) => {
    out[p.groupSlug] = (out[p.groupSlug] ?? 0) + 1;
  });
  return out;
}

let seedPromise: Promise<void> | null = null;
let isSeeded = false;

async function ensureSchemaColumns(): Promise<void> {
  try {
    await db.execute(sql`ALTER TABLE categories ADD COLUMN parent_slug VARCHAR(80) NOT NULL DEFAULT ''`);
  } catch {
    // Ignored if column exists
  }
  try {
    await db.execute(sql`ALTER TABLE products ADD COLUMN subcategory_slug VARCHAR(80) NOT NULL DEFAULT ''`);
  } catch {
    // Ignored if column exists
  }
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        customer_name VARCHAR(140) NOT NULL,
        customer_email VARCHAR(160) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'approved',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_product_reviews_product_customer (product_id, customer_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch {
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS product_reviews (
          id SERIAL PRIMARY KEY,
          product_id INT NOT NULL,
          customer_name VARCHAR(140) NOT NULL,
          customer_email VARCHAR(160) NOT NULL,
          rating INT NOT NULL,
          comment TEXT NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'approved',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uniq_product_reviews_product_customer UNIQUE (product_id, customer_email)
        );
      `);
    } catch {
      // Ignored if table exists
    }
  }
}

async function seedOnce(): Promise<void> {
  await ensureSchemaColumns();
  const [{ value: categoryCount }] = await db.select({ value: count() }).from(categories);
  if (Number(categoryCount) < CATEGORIES.length) {
    for (const [i, c] of CATEGORIES.entries()) {
      try {
        await db.insert(categories).values({
          groupSlug: c.group,
          parentSlug: c.parentSlug ?? "",
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          description: `${c.name} — ${c.tagline}. Explore the full Ridexd ${c.group} edit.`,
          imageUrl: c.image,
          sortOrder: i,
        });
      } catch {
        // Ignored if unique constraint hit
      }
    }
  }

  isSeeded = true;
}

export async function ensureSeeded(): Promise<void> {
  if (isSeeded) return;
  if (!seedPromise) {
    seedPromise = seedOnce().catch((error) => {
      seedPromise = null;
      console.warn("[ridexd] DB seeding check failed:", error?.message || error);
      throw error;
    });
  }
  await seedPromise;
}


/* ------------------------------- products -------------------------------- */

export type ProductFilters = {
  group?: string;
  category?: string;
  subcategory?: string;
  q?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  status?: string;
  page?: number;
  pageSize?: number;
};

function orderClause(sort?: string) {
  switch (sort) {
    case "price-asc":
      return asc(products.price);
    case "price-desc":
      return desc(products.price);
    case "title":
      return asc(products.title);
    case "stock":
      return desc(products.stock);
    case "oldest":
      return asc(products.id);
    // default = newest product first (last uploaded shows at the top)
    default:
      return desc(products.id);
  }
}

export async function listProducts(filters: ProductFilters = {}): Promise<{
  items: ProductRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}> {
  try {
    await ensureSeeded();
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(60, Math.max(4, filters.pageSize ?? 12));

    const conditions = [];
    if (filters.status && filters.status !== "all") {
      conditions.push(eq(products.status, filters.status));
    }
    if (filters.group && filters.group !== "all") {
      conditions.push(eq(products.groupSlug, filters.group));
    }
    if (filters.category && filters.category !== "all") {
      const prefixPattern = `${filters.category}-%`;
      conditions.push(
        or(
          eq(products.categorySlug, filters.category),
          eq(products.subcategorySlug, filters.category),
          sql`${products.subcategorySlug} LIKE ${prefixPattern}`,
        )!,
      );
    }
    if (filters.subcategory && filters.subcategory !== "all") {
      conditions.push(eq(products.subcategorySlug, filters.subcategory));
    }
    if (filters.featured) conditions.push(eq(products.featured, true));
    if (typeof filters.minPrice === "number" && !Number.isNaN(filters.minPrice)) {
      conditions.push(gte(products.price, filters.minPrice));
    }
    if (typeof filters.maxPrice === "number" && !Number.isNaN(filters.maxPrice)) {
      conditions.push(lte(products.price, filters.maxPrice));
    }
    if (filters.q) {
      const needle = `%${filters.q}%`;
      // lower()/like works on both PostgreSQL and MySQL
      const match = (column: AnyColumn) => sql`lower(${column}) like lower(${needle})`;
      conditions.push(
        or(
          match(products.title),
          match(products.subtitle),
          match(products.fabric),
          match(products.sku),
          match(products.colorFamily),
        )!,
      );
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(products)
      .where(where)
      .orderBy(orderClause(filters.sort))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ value }] = await db.select({ value: count() }).from(products).where(where);

    return {
      items: rows,
      total: Number(value),
      page,
      pageSize,
      pageCount: Math.max(1, Math.ceil(Number(value) / pageSize)),
    };
  } catch (error) {
    console.warn("[ridexd] listProducts database query failed, using in-memory catalog fallback");
    return getFallbackProducts(filters);
  }
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("[ridexd] getProductBySlug DB error, using fallback");
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProductById(id: number): Promise<ProductRow | null> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("[ridexd] getProductById DB error, using fallback");
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function getRelatedProducts(product: ProductRow, limit = 4): Promise<ProductRow[]> {
  try {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.categorySlug, product.categorySlug),
          eq(products.groupSlug, product.groupSlug),
          eq(products.status, "active"),
          sql`${products.id} <> ${product.id}`,
        ),
      )
      .limit(limit);
  } catch (error) {
    console.warn("[ridexd] getRelatedProducts DB error, using fallback");
    return FALLBACK_PRODUCTS.filter(
      (p) =>
        p.categorySlug === product.categorySlug &&
        p.groupSlug === product.groupSlug &&
        p.id !== product.id,
    ).slice(0, limit);
  }
}

export async function createProduct(values: NewProductRow) {
  await db.insert(products).values(values);
  return getProductBySlug(values.slug);
}

export async function updateProduct(id: number, values: Partial<NewProductRow>) {
  await db
    .update(products)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export async function getGroupCounts(): Promise<Record<string, number>> {
  try {
    await ensureSeeded();
    const rows = await db
      .select({ groupSlug: products.groupSlug, value: count() })
      .from(products)
      .groupBy(products.groupSlug);
    const out: Record<string, number> = {};
    rows.forEach((r: { groupSlug: string; value: number | string }) => (out[r.groupSlug] = Number(r.value)));
    return out;
  } catch (error) {
    console.warn("[ridexd] getGroupCounts DB error, using fallback");
    return getFallbackGroupCounts();
  }
}

/* ------------------------------ categories ------------------------------- */

export type CategoryWithCount = {
  id: number;
  groupSlug: string;
  parentSlug?: string;
  categorySlug: string;
  name: string;
  tagline: string;
  image: string;
  productCount: number;
};

/**
 * Categories live in the database, so any category created in the admin panel
 * instantly shows up in the storefront navigation, collection pages, filters
 * and the product form.
 */
export async function getCategoryOverview(group?: string): Promise<CategoryWithCount[]> {
  try {
    await ensureSeeded();
    const catRows = await db
      .select({
        id: categories.id,
        groupSlug: categories.groupSlug,
        parentSlug: categories.parentSlug,
        categorySlug: categories.slug,
        name: categories.name,
        tagline: categories.tagline,
        image: categories.imageUrl,
      })
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.id));

    const prodRows = await db
      .select({
        groupSlug: products.groupSlug,
        categorySlug: products.categorySlug,
        subcategorySlug: products.subcategorySlug,
      })
      .from(products);

    return catRows
      .filter((cat: { groupSlug: string }) => !group || cat.groupSlug === group)
      .map(
        (cat: {
          id: number;
          groupSlug: string;
          parentSlug: string | null;
          categorySlug: string;
          name: string;
          tagline: string;
          image: string;
        }) => {
          let count = 0;
          if (cat.parentSlug) {
            count = prodRows.filter(
              (p: { groupSlug: string; categorySlug: string; subcategorySlug: string }) =>
                p.groupSlug === cat.groupSlug &&
                (p.subcategorySlug === cat.categorySlug || p.categorySlug === cat.categorySlug),
            ).length;
          } else {
            count = prodRows.filter(
              (p: { groupSlug: string; categorySlug: string; subcategorySlug: string }) =>
                p.groupSlug === cat.groupSlug &&
                (p.categorySlug === cat.categorySlug || p.subcategorySlug.startsWith(`${cat.categorySlug}-`)),
            ).length;
          }
          return {
            id: cat.id,
            groupSlug: cat.groupSlug,
            parentSlug: cat.parentSlug || "",
            categorySlug: cat.categorySlug,
            name: cat.name,
            tagline: cat.tagline,
            image: cat.image,
            productCount: count,
          };
        },
      );
  } catch (error) {
    console.warn("[ridexd] getCategoryOverview database query failed, using fallback", error);
    return getFallbackCategories(group);
  }
}

export type CategoryInput = {
  groupSlug: string;
  parentSlug?: string;
  name: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
};

function categorySlugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(input: CategoryInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Category name is required");
  const groupSlug = input.groupSlug;
  const [{ value }] = await db
    .select({ value: count() })
    .from(categories)
    .where(eq(categories.groupSlug, groupSlug));

  const slug = categorySlugify(name);
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.groupSlug, groupSlug), eq(categories.slug, slug)))
    .limit(1);
  if (existing[0]) throw new Error("This category already exists in that department");

  await db.insert(categories).values({
    groupSlug,
    parentSlug: input.parentSlug?.trim() ?? "",
    slug,
    name,
    tagline: input.tagline?.trim() ?? "",
    description: input.description?.trim() ?? "",
    imageUrl: input.imageUrl?.trim() ?? "",
    sortOrder: Number(value ?? 0),
  });

  const created = await db
    .select()
    .from(categories)
    .where(and(eq(categories.groupSlug, groupSlug), eq(categories.slug, slug)))
    .limit(1);
  return created[0] ?? null;
}

export async function updateCategory(id: number, input: Partial<CategoryInput>) {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = String(input.name).trim();
  if (input.tagline !== undefined) patch.tagline = String(input.tagline);
  if (input.description !== undefined) patch.description = String(input.description);
  if (input.imageUrl !== undefined) patch.imageUrl = String(input.imageUrl);
  if (input.groupSlug !== undefined) patch.groupSlug = String(input.groupSlug);
  if (input.parentSlug !== undefined) patch.parentSlug = String(input.parentSlug).trim();

  await db.update(categories).set(patch).where(eq(categories.id, id));
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}

/* -------------------------------- orders --------------------------------- */

export type CheckoutItem = {
  productId: number;
  quantity: number;
  variant?: string;
};

export type CheckoutPayload = {
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  paymentMethod?: string;
  items: CheckoutItem[];
};

export async function createOrder(payload: CheckoutPayload): Promise<OrderRow> {
  await ensureSeeded();
  const ids = payload.items.map((i) => i.productId).filter((n) => Number.isFinite(n));
  if (!ids.length) throw new Error("Cart is empty");

  const found = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map<number, ProductRow>(found.map((p: ProductRow) => [p.id, p]));

  const lines = payload.items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      const quantity = Math.max(1, Math.min(20, Math.round(item.quantity)));
      return {
        product,
        quantity,
        lineTotal: product.price * quantity,
        variant: item.variant ?? "",
      };
    })
    .filter(
      (l): l is { product: ProductRow; quantity: number; lineTotal: number; variant: string } =>
        Boolean(l),
    );

  if (!lines.length) throw new Error("No valid products in cart");

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const orderNumber = `RD${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(
    Math.random() * 90 + 10,
  )}`;

  await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: payload.customerName,
      email: payload.email,
      phone: payload.phone ?? "",
      address: payload.address ?? "",
      city: payload.city ?? "",
      postalCode: payload.postalCode ?? "",
      notes: payload.notes ?? "",
      paymentMethod: payload.paymentMethod ?? "cod",
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "pending",
    });

  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  const order = orderRows[0];

  await db.insert(orderItems).values(
    lines.map((l) => ({
      orderId: order.id,
      productId: l.product.id,
      title: l.product.title,
      variant: l.variant,
      imageUrl: l.product.images?.[0] ?? "",
      unitPrice: l.product.price,
      quantity: l.quantity,
      lineTotal: l.lineTotal,
    })),
  );

  for (const line of lines) {
    await db
      .update(products)
      .set({ stock: sql`greatest(${products.stock} - ${line.quantity}, 0)` })
      .where(eq(products.id, line.product.id));
  }

  return order;
}

export async function getOrderByNumber(orderNumber: string): Promise<(OrderRow & { items: OrderItemRow[] }) | null> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber.toUpperCase()))
      .limit(1);
    const found = rows[0];
    if (!found) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, found.id));
    return { ...found, items };
  } catch (error) {
    console.warn("[ridexd] getOrderByNumber DB error:", error);
    return null;
  }
}

export async function listOrders(status?: string): Promise<OrderRow[]> {
  try {
    await ensureSeeded();
    const where = status && status !== "all" ? eq(orders.status, status) : undefined;
    return await db.select().from(orders).where(where).orderBy(desc(orders.id)).limit(200);
  } catch (error) {
    console.warn("[ridexd] listOrders DB error:", error);
    return [];
  }
}

export async function getOrderWithItems(id: number): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  try {
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!rows[0]) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    return { order: rows[0], items };
  } catch (error) {
    console.warn("[ridexd] getOrderWithItems DB error:", error);
    return null;
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<OrderRow | null> {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("[ridexd] updateOrderStatus DB error:", error);
    return null;
  }
}

export async function deleteOrder(id: number) {
  try {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  } catch (error) {
    console.warn("[ridexd] deleteOrder DB error:", error);
  }
}

/**
 * Admin order notifications. An order stops being a notification the moment it
 * is processed (status leaves "pending") or is deleted from order history.
 */
export async function listOrderNotifications(): Promise<
  Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    city: string;
    total: number;
    status: string;
    createdAt: Date;
  }>
> {
  try {
    await ensureSeeded();
    return await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        city: orders.city,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.status, "pending"))
      .orderBy(desc(orders.id))
      .limit(15);
  } catch (error) {
    console.error("[ridexd] listOrderNotifications DB error:", error);
    throw error;
  }
}

/* -------------------------------- admin ---------------------------------- */

export async function getAdminStats(): Promise<{
  products: { total: number; active: number; lowStock: number; inventoryValue: number };
  orders: { total: number; pending: number; revenue: number };
  reviews: { total: number; pending: number; avgRating: number };
  recentOrders: OrderRow[];
  topGroups: { group: string; value: number }[];
}> {
  try {
    await ensureSeeded();
    const [productAgg] = await db
      .select({
        total: count(),
        active: sql<number>`count(case when ${products.status} = 'active' then 1 end)`,
        lowStock: sql<number>`count(case when ${products.stock} <= 10 then 1 end)`,
        inventoryValue: sql<number>`coalesce(sum(${products.price} * ${products.stock}), 0)`,
      })
      .from(products);

    const [orderAgg] = await db
      .select({
        total: count(),
        pending: sql<number>`count(case when ${orders.status} = 'pending' then 1 end)`,
        revenue: sql<number>`coalesce(sum(case when ${orders.status} <> 'cancelled' then ${orders.total} else 0 end), 0)`,
      })
      .from(orders);

    let reviewTotal = 0;
    let reviewPending = 0;
    let avgRating = 0;
    try {
      const [revAgg] = await db
        .select({
          total: count(),
          pending: sql<number>`count(case when ${productReviews.status} = 'pending' then 1 end)`,
          avgRating: sql<number>`coalesce(avg(${productReviews.rating}), 0)`,
        })
        .from(productReviews);
      reviewTotal = Number(revAgg?.total ?? 0);
      reviewPending = Number(revAgg?.pending ?? 0);
      avgRating = Number(revAgg?.avgRating ?? 0);
    } catch {
      reviewTotal = FALLBACK_REVIEWS.length;
      reviewPending = FALLBACK_REVIEWS.filter((r) => r.status === "pending").length;
      avgRating =
        FALLBACK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / (FALLBACK_REVIEWS.length || 1);
    }

    const recentOrders = await db.select().from(orders).orderBy(desc(orders.id)).limit(6);
    const topGroups = await db
      .select({ groupSlug: products.groupSlug, value: count() })
      .from(products)
      .groupBy(products.groupSlug);

    return {
      products: {
        total: Number(productAgg?.total ?? 0),
        active: Number(productAgg?.active ?? 0),
        lowStock: Number(productAgg?.lowStock ?? 0),
        inventoryValue: Number(productAgg?.inventoryValue ?? 0),
      },
      orders: {
        total: Number(orderAgg?.total ?? 0),
        pending: Number(orderAgg?.pending ?? 0),
        revenue: Number(orderAgg?.revenue ?? 0),
      },
      reviews: {
        total: reviewTotal,
        pending: reviewPending,
        avgRating: Math.round(avgRating * 10) / 10,
      },
      recentOrders,
      topGroups: topGroups.map((g: { groupSlug: string; value: number | string }) => ({ group: g.groupSlug, value: Number(g.value) })),
    };
  } catch (error) {
    console.warn("[ridexd] getAdminStats DB error, returning fallback stats:", error);
    const totalProducts = FALLBACK_PRODUCTS.length;
    const activeProducts = FALLBACK_PRODUCTS.filter((p) => p.status === "active").length;
    const lowStock = FALLBACK_PRODUCTS.filter((p) => p.stock <= 10).length;
    const inventoryValue = FALLBACK_PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0);

    const topGroupsMap = getFallbackGroupCounts();
    const topGroups = Object.entries(topGroupsMap).map(([group, value]) => ({ group, value }));

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock,
        inventoryValue,
      },
      orders: {
        total: 0,
        pending: 0,
        revenue: 0,
      },
      reviews: {
        total: FALLBACK_REVIEWS.length,
        pending: FALLBACK_REVIEWS.filter((r) => r.status === "pending").length,
        avgRating: 4.7,
      },
      recentOrders: [],
      topGroups,
    };
  }
}

/* --------------------------- contact messages ---------------------------- */

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactMessageFilters = {
  status?: "all" | "unread" | "read";
  search?: string;
};

export async function createContactMessage(input: ContactMessageInput) {
  try {
    await ensureSeeded();
    await db.insert(contactMessages).values({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      message: input.message.trim(),
      isRead: false,
    });
    return true;
  } catch (error) {
    console.error("[ridexd] createContactMessage DB error:", error);
    throw error;
  }
}

export async function listContactMessages(filters: ContactMessageFilters = {}): Promise<ContactMessageRow[]> {
  try {
    await ensureSeeded();
    const conditions = [];

    if (filters.status === "unread") {
      conditions.push(eq(contactMessages.isRead, false));
    } else if (filters.status === "read") {
      conditions.push(eq(contactMessages.isRead, true));
    }

    if (filters.search) {
      const needle = `%${filters.search.trim()}%`;
      const match = (column: AnyColumn) => sql`lower(${column}) like lower(${needle})`;
      conditions.push(
        or(
          match(contactMessages.name),
          match(contactMessages.email),
          match(contactMessages.phone),
          match(contactMessages.message),
        )!,
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    return await db
      .select()
      .from(contactMessages)
      .where(where)
      .orderBy(desc(contactMessages.id))
      .limit(300);
  } catch (error) {
    console.warn("[ridexd] listContactMessages DB error:", error);
    return [];
  }
}

export async function getUnreadContactMessagesCount(): Promise<number> {
  try {
    await ensureSeeded();
    const [{ value }] = await db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));
    return Number(value);
  } catch (error) {
    console.warn("[ridexd] getUnreadContactMessagesCount DB error:", error);
    return 0;
  }
}

export async function updateContactMessageReadStatus(id: number, isRead: boolean): Promise<ContactMessageRow | null> {
  try {
    await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));
    const rows = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("[ridexd] updateContactMessageReadStatus DB error:", error);
    return null;
  }
}

export async function deleteContactMessage(id: number) {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  } catch (error) {
    console.warn("[ridexd] deleteContactMessage DB error:", error);
    return false;
  }
}

/* --------------------------- product reviews ---------------------------- */

export type ProductReviewSummary = {
  average: number;
  total: number;
  counts: { 1: number; 2: number; 3: number; 4: number; 5: number };
};

let FALLBACK_REVIEWS: ProductReviewRow[] = [
  {
    id: 1,
    productId: 1,
    customerName: "Ayesha Khan",
    customerEmail: "ayesha@example.com",
    rating: 5,
    comment: "Absolutely stunning quality and craftsmanship! The embroidery on the neckline is exquisite.",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 2,
    productId: 1,
    customerName: "Zainab Malik",
    customerEmail: "zainab@example.com",
    rating: 4,
    comment: "Very elegant fabric. Sizing fits perfectly according to the size guide. Fast shipping to Lahore!",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 3,
    productId: 2,
    customerName: "Hamza Tariq",
    customerEmail: "hamza@example.com",
    rating: 5,
    comment: "Great premium texture and comfortable fit. Highly recommended!",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
];

export async function getProductReviewSummary(productId: number): Promise<ProductReviewSummary> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  try {
    await ensureSeeded();
    const rows = await db
      .select({
        rating: productReviews.rating,
        cnt: count(),
      })
      .from(productReviews)
      .where(and(eq(productReviews.productId, productId), eq(productReviews.status, "approved")))
      .groupBy(productReviews.rating);

    let total = 0;
    let sum = 0;
    rows.forEach((r: { rating: number; cnt: number | string }) => {
      const rating = Number(r.rating);
      const cnt = Number(r.cnt);
      if (rating >= 1 && rating <= 5) {
        counts[rating] = cnt;
        total += cnt;
        sum += rating * cnt;
      }
    });

    const average = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;
    return {
      average,
      total,
      counts: counts as { 1: number; 2: number; 3: number; 4: number; 5: number },
    };
  } catch (error) {
    console.warn("[ridexd] getProductReviewSummary DB error, using fallback");
    const matching = FALLBACK_REVIEWS.filter((r) => r.productId === productId && r.status === "approved");
    let total = 0;
    let sum = 0;
    matching.forEach((r) => {
      counts[r.rating] = (counts[r.rating] ?? 0) + 1;
      total += 1;
      sum += r.rating;
    });
    return {
      average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
      total,
      counts: counts as { 1: number; 2: number; 3: number; 4: number; 5: number },
    };
  }
}

export async function listProductReviews(
  productId: number,
  page = 1,
  pageSize = 10,
  includePendingEmail?: string,
): Promise<{ items: ProductReviewRow[]; total: number; page: number; pageSize: number; pageCount: number }> {
  try {
    await ensureSeeded();
    const p = Math.max(1, page);
    const ps = Math.min(50, Math.max(1, pageSize));

    const statusCondition = includePendingEmail
      ? or(
          eq(productReviews.status, "approved"),
          and(
            eq(productReviews.status, "pending"),
            sql`lower(${productReviews.customerEmail}) = lower(${includePendingEmail.trim()})`,
          ),
        )
      : eq(productReviews.status, "approved");

    const where = and(eq(productReviews.productId, productId), statusCondition);

    const rows = await db
      .select()
      .from(productReviews)
      .where(where)
      .orderBy(desc(productReviews.createdAt), desc(productReviews.id))
      .limit(ps)
      .offset((p - 1) * ps);

    const [{ value }] = await db.select({ value: count() }).from(productReviews).where(where);
    const total = Number(value);

    return {
      items: rows,
      total,
      page: p,
      pageSize: ps,
      pageCount: Math.max(1, Math.ceil(total / ps)),
    };
  } catch (error) {
    console.warn("[ridexd] listProductReviews DB error, using fallback");
    const matching = FALLBACK_REVIEWS.filter(
      (r) =>
        r.productId === productId &&
        (r.status === "approved" ||
          (includePendingEmail &&
            r.customerEmail.toLowerCase() === includePendingEmail.toLowerCase().trim())),
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = matching.length;
    const items = matching.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      total,
      page,
      pageSize,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}

export async function getCustomerProductReview(
  productId: number,
  customerEmail: string,
): Promise<ProductReviewRow | null> {
  const email = customerEmail.trim().toLowerCase();
  if (!email) return null;
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productId, productId),
          sql`lower(${productReviews.customerEmail}) = lower(${email})`,
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    return (
      FALLBACK_REVIEWS.find(
        (r) => r.productId === productId && r.customerEmail.toLowerCase() === email,
      ) ?? null
    );
  }
}

export async function createOrUpdateReview(input: {
  productId: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
}): Promise<ProductReviewRow> {
  await ensureSeeded();
  const name = input.customerName.trim();
  const email = input.customerEmail.trim().toLowerCase();
  const comment = input.comment.trim();
  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));

  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
  if (!comment || comment.length < 3) throw new Error("Review comment must be at least 3 characters");
  if (comment.length > 2000) throw new Error("Review comment must not exceed 2000 characters");

  const existing = await getCustomerProductReview(input.productId, email);

  if (existing) {
    try {
      await db
        .update(productReviews)
        .set({
          customerName: name,
          rating,
          comment,
          updatedAt: new Date(),
        })
        .where(eq(productReviews.id, existing.id));

      const updated = await db
        .select()
        .from(productReviews)
        .where(eq(productReviews.id, existing.id))
        .limit(1);
      return updated[0] ?? { ...existing, customerName: name, rating, comment, updatedAt: new Date() };
    } catch (error) {
      console.warn("[ridexd] createOrUpdateReview update error:", error);
      existing.customerName = name;
      existing.rating = rating;
      existing.comment = comment;
      existing.updatedAt = new Date();
      return existing;
    }
  } else {
    try {
      await db.insert(productReviews).values({
        productId: input.productId,
        customerName: name,
        customerEmail: email,
        rating,
        comment,
        status: "approved",
      });

      const created = await db
        .select()
        .from(productReviews)
        .where(
          and(
            eq(productReviews.productId, input.productId),
            sql`lower(${productReviews.customerEmail}) = lower(${email})`,
          ),
        )
        .limit(1);

      if (created[0]) return created[0];
    } catch (error) {
      console.warn("[ridexd] createOrUpdateReview insert DB error, fallback used:", error);
    }

    const newRev: ProductReviewRow = {
      id: Date.now(),
      productId: input.productId,
      customerName: name,
      customerEmail: email,
      rating,
      comment,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    FALLBACK_REVIEWS.unshift(newRev);
    return newRev;
  }
}

export async function deleteCustomerReview(id: number, customerEmail: string): Promise<boolean> {
  const email = customerEmail.trim().toLowerCase();
  try {
    await db
      .delete(productReviews)
      .where(
        and(
          eq(productReviews.id, id),
          sql`lower(${productReviews.customerEmail}) = lower(${email})`,
        ),
      );
    FALLBACK_REVIEWS = FALLBACK_REVIEWS.filter(
      (r) => !(r.id === id && r.customerEmail.toLowerCase() === email),
    );
    return true;
  } catch (error) {
    FALLBACK_REVIEWS = FALLBACK_REVIEWS.filter(
      (r) => !(r.id === id && r.customerEmail.toLowerCase() === email),
    );
    return true;
  }
}

export async function listAdminReviews(filters: {
  productId?: number;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: (ProductReviewRow & { productTitle?: string })[]; total: number; page: number; pageSize: number; pageCount: number }> {
  try {
    await ensureSeeded();
    const p = Math.max(1, filters.page ?? 1);
    const ps = Math.min(100, Math.max(1, filters.pageSize ?? 20));

    const conditions = [];
    if (typeof filters.productId === "number" && !Number.isNaN(filters.productId)) {
      conditions.push(eq(productReviews.productId, filters.productId));
    }
    if (filters.status && filters.status !== "all") {
      conditions.push(eq(productReviews.status, filters.status));
    }
    if (filters.search) {
      const needle = `%${filters.search.trim()}%`;
      const match = (column: AnyColumn) => sql`lower(${column}) like lower(${needle})`;
      conditions.push(
        or(
          match(productReviews.customerName),
          match(productReviews.customerEmail),
          match(productReviews.comment),
        )!,
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        customerName: productReviews.customerName,
        customerEmail: productReviews.customerEmail,
        rating: productReviews.rating,
        comment: productReviews.comment,
        status: productReviews.status,
        createdAt: productReviews.createdAt,
        updatedAt: productReviews.updatedAt,
        productTitle: products.title,
      })
      .from(productReviews)
      .leftJoin(products, eq(productReviews.productId, products.id))
      .where(where)
      .orderBy(desc(productReviews.id))
      .limit(ps)
      .offset((p - 1) * ps);

    const [{ value }] = await db.select({ value: count() }).from(productReviews).where(where);
    const total = Number(value);

    return {
      items: rows.map((r: { id: number; productId: number; customerName: string; customerEmail: string; rating: number; comment: string; status: string; createdAt: Date; updatedAt: Date; productTitle: string | null }) => ({ ...r, productTitle: r.productTitle ?? undefined })),
      total,
      page: p,
      pageSize: ps,
      pageCount: Math.max(1, Math.ceil(total / ps)),
    };
  } catch (error) {
    console.warn("[ridexd] listAdminReviews DB error, returning fallback reviews");
    let items = [...FALLBACK_REVIEWS];
    if (filters.productId) items = items.filter((r) => r.productId === filters.productId);
    if (filters.status && filters.status !== "all") items = items.filter((r) => r.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.customerEmail.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q),
      );
    }
    const total = items.length;
    const paged = items.slice(((filters.page ?? 1) - 1) * (filters.pageSize ?? 20), (filters.page ?? 1) * (filters.pageSize ?? 20));
    return {
      items: paged.map((r) => {
        const prod = FALLBACK_PRODUCTS.find((p) => p.id === r.productId);
        return { ...r, productTitle: prod?.title };
      }),
      total,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 20,
      pageCount: Math.max(1, Math.ceil(total / (filters.pageSize ?? 20))),
    };
  }
}

export async function updateReviewStatus(id: number, status: string): Promise<ProductReviewRow | null> {
  try {
    await db.update(productReviews).set({ status, updatedAt: new Date() }).where(eq(productReviews.id, id));
    const rows = await db.select().from(productReviews).where(eq(productReviews.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    const rev = FALLBACK_REVIEWS.find((r) => r.id === id);
    if (rev) {
      rev.status = status;
      rev.updatedAt = new Date();
      return rev;
    }
    return null;
  }
}

export async function deleteReviewAdmin(id: number): Promise<boolean> {
  try {
    await db.delete(productReviews).where(eq(productReviews.id, id));
    FALLBACK_REVIEWS = FALLBACK_REVIEWS.filter((r) => r.id !== id);
    return true;
  } catch (error) {
    FALLBACK_REVIEWS = FALLBACK_REVIEWS.filter((r) => r.id !== id);
    return true;
  }
}

export async function getProductRatingMap(
  productIds: number[],
): Promise<Record<number, { avg: number; total: number }>> {
  const result: Record<number, { avg: number; total: number }> = {};
  if (!productIds.length) return result;

  try {
    const rows = await db
      .select({
        productId: productReviews.productId,
        avgRating: sql<number>`coalesce(avg(${productReviews.rating}), 0)`,
        total: count(),
      })
      .from(productReviews)
      .where(
        and(
          inArray(productReviews.productId, productIds),
          eq(productReviews.status, "approved"),
        ),
      )
      .groupBy(productReviews.productId);

    rows.forEach((r: { productId: number; avgRating: number | string; total: number | string }) => {
      result[r.productId] = {
        avg: Math.round(Number(r.avgRating) * 10) / 10,
        total: Number(r.total),
      };
    });
  } catch (error) {
    FALLBACK_REVIEWS.forEach((r) => {
      if (r.status === "approved" && productIds.includes(r.productId)) {
        if (!result[r.productId]) {
          result[r.productId] = { avg: 0, total: 0 };
        }
        const curr = result[r.productId];
        const newTotal = curr.total + 1;
        const newAvg = (curr.avg * curr.total + r.rating) / newTotal;
        result[r.productId] = { avg: Math.round(newAvg * 10) / 10, total: newTotal };
      }
    });
  }

  return result;
}

export async function hasCustomerPurchasedProduct(
  customerEmail: string,
  productId: number,
): Promise<boolean> {
  const email = customerEmail.trim().toLowerCase();
  if (!email) return false;

  try {
    const rows = await db
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(
        and(
          sql`lower(${orders.email}) = lower(${email})`,
          eq(orderItems.productId, productId),
          sql`${orders.status} <> 'cancelled'`,
        ),
      )
      .limit(1);

    return rows.length > 0;
  } catch {
    return false;
  }
}


