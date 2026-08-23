import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL || "";
const isPg = url.startsWith("postgres://") || url.startsWith("postgresql://");

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: isPg ? "postgresql" : "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "mysql://127.0.0.1:3306/ridexd",
  },
});
