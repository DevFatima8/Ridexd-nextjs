#!/usr/bin/env node
/**
 * Switch Ridexd.com back to PostgreSQL (local sandbox / preview).
 *
 *   node scripts/use-postgres.mjs
 */
import { copyFileSync } from "node:fs";

copyFileSync("src/db/schema.pg.ts", "src/db/schema.ts");
copyFileSync("src/db/index.pg.ts", "src/db/index.ts");

console.log("✅ PostgreSQL mode ON (node-postgres driver)");
