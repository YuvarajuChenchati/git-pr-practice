const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ENV = process.env.APP_ENV || "development";

app.use(express.json());

// Visual UI Dashboard for interactive learning
app.get("/", (req, res) => {
  const containerInfo = {
    hostname: os.hostname(), // In docker, hostname equals the container ID!
    platform: os.platform(),
    release: os.release(),
    architecture: os.arch(),
    cpus: os.cpus().length,
    totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
    freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
    uptimeSeconds: Math.round(os.uptime()),
    nodeVersion: process.version,
    appEnv: APP_ENV,
    clientIp: req.ip || req.connection.remoteAddress
  };

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐳 Docker Diagnostic Dashboard</title>
    <style>
      :root {
        --bg: #0b0f19;
        --card-bg: #161e31;
        --border: #23304d;
        --accent: #38bdf8;
        --text: #f1f5f9;
        --text-muted: #94a3b8;
        --success: #34d399;
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: var(--bg);
        color: var(--text);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 24px;
        box-sizing: border-box;
      }
      .container {
        max-width: 800px;
        width: 100%;
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        padding: 32px;
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(52, 211, 153, 0.15);
        color: var(--success);
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 12px;
      }
      h1 { margin: 0 0 8px; font-size: 2rem; }
      p.subtitle { color: var(--text-muted); margin: 0 0 24px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .card {
        background: #0f172a;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 16px;
      }
      .card-title { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px; }
      .card-value { font-size: 1.25rem; font-weight: 700; color: var(--accent); }
      .endpoints {
        background: #0f172a;
        border-radius: 10px;
        padding: 16px;
        border: 1px solid var(--border);
      }
      code { color: #38bdf8; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="badge">● Container Online</div>
      <h1>🎉 You Successfully Ran a Docker Container!</h1>
      <p class="subtitle">This page was served directly from inside your isolated Linux container.</p>

      <div class="grid">
        <div class="card">
          <div class="card-title">Container ID (Hostname)</div>
          <div class="card-value">${containerInfo.hostname}</div>
        </div>
        <div class="card">
          <div class="card-title">Operating System</div>
          <div class="card-value">${containerInfo.platform} (${containerInfo.release})</div>
        </div>
        <div class="card">
          <div class="card-title">Node Runtime</div>
          <div class="card-value">${containerInfo.nodeVersion}</div>
        </div>
        <div class="card">
          <div class="card-title">Environment (APP_ENV)</div>
          <div class="card-value">${containerInfo.appEnv}</div>
        </div>
        <div class="card">
          <div class="card-title">Memory Allocation</div>
          <div class="card-value">${containerInfo.freeMemoryMB}MB / ${containerInfo.totalMemoryMB}MB</div>
        </div>
        <div class="card">
          <div class="card-title">Uptime</div>
          <div class="card-value">${containerInfo.uptimeSeconds}s</div>
        </div>
      </div>

      <div class="endpoints">
        <div class="card-title">Diagnostic API Endpoints to Test:</div>
        <ul style="margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
          <li><code>GET /api/info</code> - JSON breakdown of container internals</li>
          <li><code>GET /api/health</code> - Healthcheck probe for Docker Compose & Kubernetes</li>
        </ul>
      </div>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

// JSON API endpoints
app.get("/api/info", (req, res) => {
  res.json({
    containerId: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    architecture: os.arch(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    uptime: os.uptime(),
    env: process.env.APP_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: Date.now() });
});

// IMPORTANT: Bind to 0.0.0.0 so external docker port forwarding works!
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Diagnostic API listening on http://0.0.0.0:${PORT}`);
});
