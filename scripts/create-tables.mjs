import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database...", databaseUrl.replace(/:[^:@]+@/, ":****@"));
  try {
    const connection = await mysql.createConnection({
      uri: databaseUrl,
      multipleStatements: true,
    });
    console.log("Connected successfully!");

    const sqlPath = path.join(process.cwd(), "mysql", "schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    console.log("Executing mysql/schema.sql to create tables...");
    await connection.query(sql);
    console.log("✅ Tables created successfully!");

    const [tables] = await connection.query("SHOW TABLES;");
    console.log("Tables in database:", tables);

    await connection.end();
  } catch (err) {
    console.error("❌ Database setup failed:", err);
  }
}

run();
