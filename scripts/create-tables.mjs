import mysql from "mysql2/promise";
import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1);
}

const isPg = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");

async function run() {
  const safeUrl = databaseUrl.replace(/:[^:@]+@/, ":****@");
  console.log(`Connecting to ${isPg ? "PostgreSQL" : "MySQL"} database: ${safeUrl}`);

  if (isPg) {
    const client = new pg.Client({ connectionString: databaseUrl });
    try {
      await client.connect();
      console.log("Connected successfully to PostgreSQL!");

      const sql = `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          group_slug VARCHAR(40) NOT NULL,
          slug VARCHAR(80) NOT NULL,
          name VARCHAR(120) NOT NULL,
          tagline VARCHAR(200) NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',
          image_url TEXT NOT NULL DEFAULT '',
          sort_order INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uniq_categories_group_slug UNIQUE (group_slug, slug)
        );

        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(140) NOT NULL UNIQUE,
          title VARCHAR(200) NOT NULL,
          subtitle VARCHAR(200) NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',
          group_slug VARCHAR(40) NOT NULL,
          category_slug VARCHAR(80) NOT NULL,
          price INT NOT NULL DEFAULT 0,
          compare_at_price INT NOT NULL DEFAULT 0,
          cost INT NOT NULL DEFAULT 0,
          sku VARCHAR(60) NOT NULL DEFAULT '',
          barcode VARCHAR(60) NOT NULL DEFAULT '',
          stock INT NOT NULL DEFAULT 0,
          sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          fabric VARCHAR(120) NOT NULL DEFAULT '',
          color_family VARCHAR(60) NOT NULL DEFAULT '',
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          featured BOOLEAN NOT NULL DEFAULT false,
          vendor VARCHAR(80) NOT NULL DEFAULT 'Ridexd',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number VARCHAR(40) NOT NULL UNIQUE,
          customer_name VARCHAR(140) NOT NULL,
          email VARCHAR(160) NOT NULL,
          phone VARCHAR(40) NOT NULL DEFAULT '',
          address TEXT NOT NULL DEFAULT '',
          city VARCHAR(80) NOT NULL DEFAULT '',
          postal_code VARCHAR(30) NOT NULL DEFAULT '',
          notes TEXT NOT NULL DEFAULT '',
          payment_method VARCHAR(40) NOT NULL DEFAULT 'cod',
          subtotal INT NOT NULL DEFAULT 0,
          shipping INT NOT NULL DEFAULT 0,
          total INT NOT NULL DEFAULT 0,
          status VARCHAR(24) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id INT NOT NULL,
          title VARCHAR(200) NOT NULL,
          variant VARCHAR(60) NOT NULL DEFAULT '',
          image_url TEXT NOT NULL DEFAULT '',
          unit_price INT NOT NULL DEFAULT 0,
          quantity INT NOT NULL DEFAULT 1,
          line_total INT NOT NULL DEFAULT 0
        );
      `;
      console.log("Executing PostgreSQL table creation query...");
      await client.query(sql);
      console.log("✅ Tables created successfully in PostgreSQL!");

      const res = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
      );
      console.log("Tables in database:", res.rows.map((r) => r.table_name));

      await client.end();
    } catch (err) {
      console.error("❌ PostgreSQL database setup failed:", err.message);
      process.exit(1);
    }
  } else {
    try {
      const connection = await mysql.createConnection({
        uri: databaseUrl,
        multipleStatements: true,
      });
      console.log("Connected successfully to MySQL!");

      const sqlPath = path.join(process.cwd(), "mysql", "schema.sql");
      const sql = fs.readFileSync(sqlPath, "utf-8");

      console.log("Executing mysql/schema.sql to create tables...");
      await connection.query(sql);
      console.log("✅ Tables created successfully in MySQL!");

      const [tables] = await connection.query("SHOW TABLES;");
      console.log("Tables in database:", tables);

      await connection.end();
    } catch (err) {
      console.error("❌ MySQL database setup failed:", err.message || err);
      if (err.code === "ETIMEDOUT") {
        console.error("\n💡 Connection timed out. Hints:");
        console.error("1. If running on Hostinger, ensure host is set to 127.0.0.1 when code runs on Hostinger server.");
        console.error("2. If running from local PC to Hostinger remote MySQL, enable Remote MySQL in Hostinger hPanel for your IP (or %).");
        console.error("3. Or import mysql/schema.sql directly in phpMyAdmin!\n");
      }
      process.exit(1);
    }
  }
}

run();
