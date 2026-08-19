import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Ridexd.com — ecommerce schema
 *
 * MySQL deployment (Hostinger): import `mysql/schema.sql` in phpMyAdmin, or use
 * the drop-in Drizzle mysql-core version in `mysql/schema.mysql.ts`.
 */

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    groupSlug: varchar("group_slug", { length: 40 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull().default(""),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("categories_group_slug_key").on(table.groupSlug, table.slug)],
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 200 }).notNull().default(""),
  description: text("description").notNull().default(""),
  groupSlug: varchar("group_slug", { length: 40 }).notNull(),
  categorySlug: varchar("category_slug", { length: 80 }).notNull(),
  price: integer("price").notNull().default(0),
  compareAtPrice: integer("compare_at_price").notNull().default(0),
  cost: integer("cost").notNull().default(0),
  sku: varchar("sku", { length: 60 }).notNull().default(""),
  barcode: varchar("barcode", { length: 60 }).notNull().default(""),
  stock: integer("stock").notNull().default(0),
  sizes: jsonb("sizes").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  fabric: varchar("fabric", { length: 120 }).notNull().default(""),
  colorFamily: varchar("color_family", { length: 60 }).notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  featured: boolean("featured").notNull().default(false),
  vendor: varchar("vendor", { length: 80 }).notNull().default("Ridexd"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 140 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  address: text("address").notNull().default(""),
  city: varchar("city", { length: 80 }).notNull().default(""),
  postalCode: varchar("postal_code", { length: 30 }).notNull().default(""),
  notes: text("notes").notNull().default(""),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull().default("cod"),
  subtotal: integer("subtotal").notNull().default(0),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: varchar("status", { length: 24 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  variant: varchar("variant", { length: 60 }).notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  unitPrice: integer("unit_price").notNull().default(0),
  quantity: integer("quantity").notNull().default(1),
  lineTotal: integer("line_total").notNull().default(0),
});

export type CategoryRow = typeof categories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
