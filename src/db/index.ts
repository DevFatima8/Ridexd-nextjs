/**
 * Ridexd.com — MySQL / Hostinger database connection (mysql2 + Drizzle)
 * ------------------------------------------------------------------
 * Activate with:  node scripts/use-mysql.mjs
 * Deactivate with: node scripts/use-postgres.mjs
 *
 * DATABASE_URL example (Hostinger):
 * mysql://u123456789_ridexd:YourStrongPassword@127.0.0.1:3306/u123456789_ridexd
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required (mysql://user:password@host:3306/database)");
}

const globalForDb = globalThis as typeof globalThis & {
  __ridexdMysqlPool?: mysql.Pool;
};

export const pool =
  globalForDb.__ridexdMysqlPool ??
  mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 10,
    waitForConnections: true,
    charset: "utf8mb4_unicode_ci",
    timezone: "Z",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__ridexdMysqlPool = pool;
}

export const db = drizzle(pool);
