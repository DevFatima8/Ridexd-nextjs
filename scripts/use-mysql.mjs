#!/usr/bin/env node
/**
 * Switch Ridexd.com to MySQL (Hostinger / cPanel / VPS).
 *
 *   node scripts/use-mysql.mjs
 *
 * - copies src/db/schema.mysql.ts -> src/db/schema.ts
 * - copies src/db/index.mysql.ts  -> src/db/index.ts
 */
import { copyFileSync } from "node:fs";

copyFileSync("src/db/schema.mysql.ts", "src/db/schema.ts");
copyFileSync("src/db/index.mysql.ts", "src/db/index.ts");

console.log("✅ MySQL mode ON  (Drizzle mysql-core + mysql2 driver)");
console.log("   Ab .env mein DATABASE_URL=mysql://user:pass@127.0.0.1:3306/dbname set karein");
console.log("   Tables ke liye: phpMyAdmin mein mysql/schema.sql import karein");
