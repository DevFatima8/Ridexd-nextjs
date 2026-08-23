import "dotenv/config";
import { db } from "../src/db/index.js";
import { categories, products } from "../src/db/schema.js";
import { CATEGORIES } from "../src/lib/catalog.js";
import { SEED_PRODUCTS } from "../src/lib/seed-data.js";
import { count, eq, and } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Seed Categories
    console.log("📦 Checking categories...");
    let addedCategories = 0;
    for (let i = 0; i < CATEGORIES.length; i++) {
      const c = CATEGORIES[i];
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(eq(categories.groupSlug, c.group), eq(categories.slug, c.slug)))
        .limit(1);

      if (!existing.length) {
        await db.insert(categories).values({
          groupSlug: c.group,
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          description: `${c.name} — ${c.tagline}. Explore the full Ridexd ${c.group} edit.`,
          imageUrl: c.image,
          sortOrder: i,
        });
        addedCategories++;
      }
    }
    const [{ value: totalCats }] = await db.select({ value: count() }).from(categories);
    console.log(`✅ Categories ready: ${totalCats} in DB (${addedCategories} newly inserted)`);

    // 2. Seed Products
    console.log("🛍️ Checking products...");
    let addedProducts = 0;
    for (let i = 0; i < SEED_PRODUCTS.length; i += 25) {
      const chunk = SEED_PRODUCTS.slice(i, i + 25);
      for (const p of chunk) {
        const existing = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, p.slug))
          .limit(1);

        if (!existing.length) {
          await db.insert(products).values({ ...p, barcode: "" });
          addedProducts++;
        }
      }
    }
    const [{ value: totalProds }] = await db.select({ value: count() }).from(products);
    console.log(`✅ Products ready: ${totalProds} in DB (${addedProducts} newly inserted)`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
