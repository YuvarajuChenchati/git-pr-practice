const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "mysql-db";
const DB_USER = process.env.DB_USER || "app_user";
const DB_PASSWORD = process.env.DB_PASSWORD || "app_secret123";
const DB_NAME = process.env.DB_NAME || "app_database";
const REDIS_HOST = process.env.REDIS_HOST || "redis-cache";

let dbPool;
let redisClient;

async function initConnections() {
  console.log("Connecting to Redis at:", REDIS_HOST);
  redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
  redisClient.on("error", (err) => console.error("Redis Error:", err.message));
  await redisClient.connect();
  console.log("Connected to Redis successfully!");

  console.log("Connecting to MySQL at:", DB_HOST);
  dbPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Create table if not exists and insert seed data
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [existing] = await dbPool.query("SELECT COUNT(*) as count FROM users");
  if (existing[0].count === 0) {
    await dbPool.query(`
      INSERT INTO users (name, email) VALUES
      ('Alice Johnson', 'alice@docker.local'),
      ('Bob Smith', 'bob@docker.local')
    `);
    console.log("Seeded initial user data into MySQL!");
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Project 02: Node.js + MySQL + Redis Microservice Stack",
    endpoints: {
      "GET /users": "Fetch all users (cached via Redis)",
      "POST /users": "Create new user (invalidates Redis cache)",
      "GET /health": "Stack health check"
    }
  });
});

app.get("/users", async (req, res) => {
  const start = Date.now();
  try {
    // 1. Check Redis Cache
    const cachedUsers = await redisClient.get("all_users");
    if (cachedUsers) {
      const duration = Date.now() - start;
      return res.json({
        source: "⚡ REDIS CACHE HIT",
        durationMs: duration,
        data: JSON.parse(cachedUsers)
      });
    }

    // 2. Cache Miss: Query MySQL Database
    const [rows] = await dbPool.query("SELECT * FROM users ORDER BY id DESC");

    // 3. Store in Redis with 30-second TTL
    await redisClient.set("all_users", JSON.stringify(rows), { EX: 30 });

    const duration = Date.now() - start;
    return res.json({
      source: "🗄️ MYSQL DATABASE QUERY (Cache Miss)",
      durationMs: duration,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const [result] = await dbPool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    // Invalidate Redis cache so next GET fetches fresh data
    await redisClient.del("all_users");

    res.status(201).json({
      message: "User created successfully!",
      id: result.insertId,
      name,
      email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", async (req, res) => {
  try {
    await dbPool.query("SELECT 1");
    await redisClient.ping();
    res.json({ status: "healthy", mysql: "connected", redis: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", error: err.message });
  }
});

// Start server and handle DB connection retry if containers are booting
setTimeout(async () => {
  try {
    await initConnections();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Initialization failed:", err.message);
    process.exit(1);
  }
}, 3000);
