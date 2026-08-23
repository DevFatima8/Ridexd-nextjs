import { and, asc, count, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, orderItems, orders, products } from "@/db/schema";
import type { NewProductRow, ProductRow } from "@/db/schema";
import type { AnyColumn } from "drizzle-orm";
import { CATEGORIES } from "./catalog";
import { SEED_PRODUCTS } from "./seed-data";

const FALLBACK_PRODUCTS: ProductRow[] = [];

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
    items = items.filter((p) => p.categorySlug === filters.category);
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
    const count = FALLBACK_PRODUCTS.filter(
      (p) => p.groupSlug === c.group && p.categorySlug === c.slug,
    ).length;
    return {
      id: i + 1,
      groupSlug: c.group,
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

async function seedOnce(): Promise<void> {
  const [{ value: categoryCount }] = await db.select({ value: count() }).from(categories);
  if (Number(categoryCount) === 0) {
    await db
      .insert(categories)
      .values(
        CATEGORIES.map((c, i) => ({
          groupSlug: c.group,
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          description: `${c.name} — ${c.tagline}. Explore the full Ridexd ${c.group} edit.`,
          imageUrl: c.image,
          sortOrder: i,
        })),
      );
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

export async function listProducts(filters: ProductFilters = {}) {
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
      conditions.push(eq(products.categorySlug, filters.category));
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

export async function getRelatedProducts(product: ProductRow, limit = 4) {
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
    rows.forEach((r) => (out[r.groupSlug] = Number(r.value)));
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
    const rows = await db
      .select({
        id: categories.id,
        groupSlug: categories.groupSlug,
        categorySlug: categories.slug,
        name: categories.name,
        tagline: categories.tagline,
        image: categories.imageUrl,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(
        products,
        and(eq(products.groupSlug, categories.groupSlug), eq(products.categorySlug, categories.slug)),
      )
      .groupBy(
        categories.id,
        categories.groupSlug,
        categories.slug,
        categories.name,
        categories.tagline,
        categories.imageUrl,
        categories.sortOrder,
      )
      .orderBy(asc(categories.sortOrder), asc(categories.id));

    return rows
      .filter((row) => !group || row.groupSlug === group)
      .map((row) => ({
        id: row.id,
        groupSlug: row.groupSlug,
        categorySlug: row.categorySlug,
        name: row.name,
        tagline: row.tagline,
        image: row.image,
        productCount: Number(row.productCount ?? 0),
      }));
  } catch (error) {
    console.warn("[ridexd] getCategoryOverview database query failed, using fallback");
    return getFallbackCategories(group);
  }
}

export type CategoryInput = {
  groupSlug: string;
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

export async function createOrder(payload: CheckoutPayload) {
  await ensureSeeded();
  const ids = payload.items.map((i) => i.productId).filter((n) => Number.isFinite(n));
  if (!ids.length) throw new Error("Cart is empty");

  const found = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(found.map((p) => [p.id, p]));

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

export async function getOrderByNumber(orderNumber: string) {
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

export async function listOrders(status?: string) {
  try {
    await ensureSeeded();
    const where = status && status !== "all" ? eq(orders.status, status) : undefined;
    return await db.select().from(orders).where(where).orderBy(desc(orders.id)).limit(200);
  } catch (error) {
    console.warn("[ridexd] listOrders DB error:", error);
    return [];
  }
}

export async function getOrderWithItems(id: number) {
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

export async function updateOrderStatus(id: number, status: string) {
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
export async function listOrderNotifications() {
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

export async function getAdminStats() {
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
      recentOrders,
      topGroups: topGroups.map((g) => ({ group: g.groupSlug, value: Number(g.value) })),
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
      recentOrders: [],
      topGroups,
    };
  }
}
