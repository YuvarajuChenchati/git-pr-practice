const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "🛡️ Running in hardened production container!",
    user: process.getuid ? (process.getuid() === 0 ? "root" : "non-root (secure)") : "windows",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Clean SIGTERM handler (complements dumb-init)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated cleanly.");
    process.exit(0);
  });
});
