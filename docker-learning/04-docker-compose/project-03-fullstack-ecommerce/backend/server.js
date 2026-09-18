const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "db";
const DB_USER = process.env.DB_USER || "ecommerce_user";
const DB_PASSWORD = process.env.DB_PASSWORD || "ecommerce_secret";
const DB_NAME = process.env.DB_NAME || "ecommerce_db";
const REDIS_HOST = process.env.REDIS_HOST || "redis";

let dbPool;
let redisClient;

async function init() {
  console.log("Connecting to Redis...");
  redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
  redisClient.on("error", (e) => console.log("Redis:", e.message));
  await redisClient.connect();

  console.log("Connecting to MySQL...");
  dbPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  console.log("All datastores ready!");
}

app.get("/api/health", async (req, res) => {
  try {
    await dbPool.query("SELECT 1");
    await redisClient.ping();
    res.json({ status: "healthy", database: "connected", redis: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", error: err.message });
  }
});

// GET /api/products (cached with Redis)
app.get("/api/products", async (req, res) => {
  const start = Date.now();
  try {
    const cached = await redisClient.get("products_list");
    if (cached) {
      return res.json({
        cached: true,
        latencyMs: Date.now() - start,
        products: JSON.parse(cached)
      });
    }

    const [rows] = await dbPool.query("SELECT * FROM products ORDER BY id ASC");
    await redisClient.set("products_list", JSON.stringify(rows), { EX: 60 });

    res.json({
      cached: false,
      latencyMs: Date.now() - start,
      products: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders (creates order and deducts stock)
app.post("/api/orders", async (req, res) => {
  const { productId, quantity = 1, email } = req.body;
  if (!productId || !email) {
    return res.status(400).json({ error: "productId and email are required" });
  }

  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    const [prod] = await conn.query("SELECT * FROM products WHERE id = ? FOR UPDATE", [productId]);
    if (prod.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    if (prod[0].stock < quantity) {
      await conn.rollback();
      return res.status(400).json({ error: "Insufficient stock" });
    }

    await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, productId]);
    const [orderResult] = await conn.query(
      "INSERT INTO orders (product_id, quantity, customer_email) VALUES (?, ?, ?)",
      [productId, quantity, email]
    );

    await conn.commit();

    // Invalidate product cache
    await redisClient.del("products_list");

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: orderResult.insertId,
      productId,
      quantity,
      remainingStock: prod[0].stock - quantity
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

init().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend API listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
