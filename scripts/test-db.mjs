import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is missing in environment");
  process.exit(1);
}

async function runTest() {
  console.log("🔍 Testing Hostinger MySQL connection...");
  const pool = mysql.createPool({
    uri: databaseUrl,
    connectionLimit: 5,
    waitForConnections: true,
    connectTimeout: 5000,
  });

  try {
    // Test 1: SELECT 1
    const [rows1] = await pool.query("SELECT 1 as alive;");
    console.log("✅ Connection Test (SELECT 1): SUCCESS", rows1);

    // Test 2: Orders query
    const [rows2] = await pool.query(
      "SELECT `id`, `order_number`, `customer_name`, `city`, `total`, `status`, `created_at` FROM `orders` WHERE `status` = ? ORDER BY `id` DESC LIMIT 15;",
      ["pending"]
    );
    console.log("✅ Orders Query Test: SUCCESS", rows2);
  } catch (error) {
    console.error("❌ Connection failed:", error.code || error.message);
  } finally {
    await pool.end();
  }
}

runTest();
