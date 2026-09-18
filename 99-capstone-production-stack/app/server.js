const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prometheus Default Metrics (CPU, Memory, Event Loop, GC)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'node_app_' });

// Custom Business & SRE Metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

const totalHttpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made',
  labelNames: ['method', 'route', 'code']
});

const activeConnections = new client.Gauge({
  name: 'http_active_connections',
  help: 'Current active requests in flight'
});

// Prometheus Scrape Middleware
app.use((req, res, next) => {
  if (req.path === '/metrics') {
    return next();
  }

  activeConnections.inc();
  const end = httpRequestDurationMicroseconds.startTimer();

  res.on('finish', () => {
    activeConnections.dec();
    const route = req.route ? req.route.path : req.path;
    end({ method: req.method, route: route, code: res.statusCode });
    totalHttpRequests.inc({ method: req.method, route: route, code: res.statusCode });
  });

  next();
});

// Standard Routes
app.get('/', (req, res) => {
  res.json({
    app: 'DevOps Capstone Production Microservice',
    status: 'online',
    version: 'v1.4.0',
    endpoints: {
      metrics: '/metrics',
      health: '/healthz',
      ready: '/readyz',
      checkout: '/api/checkout',
      products: '/api/products',
      simulate_slow: '/api/slow?delayMs=1200',
      simulate_error: '/api/error?rate=0.5'
    }
  });
});

// Liveness & Readiness Probes (for Kubernetes)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

let isReady = true;
app.get('/readyz', (req, res) => {
  if (isReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'warming_up_or_draining' });
  }
});

// Realistic API Routes
app.get('/api/products', (req, res) => {
  res.json([
    { id: 'item-101', name: 'Cloud Native Sticker Pack', price: 9.99, stock: 450 },
    { id: 'item-102', name: 'DevOps Mechanical Keyboard', price: 149.99, stock: 42 },
    { id: 'item-103', name: 'Kubernetes Plushie Toy', price: 24.50, stock: 120 }
  ]);
});

app.post('/api/checkout', (req, res) => {
  // Simulate 98% success, 2% transient payment failure
  const isFail = Math.random() < 0.02;
  if (isFail) {
    return res.status(500).json({ error: 'PaymentGatewayTimeout', message: 'Downstream bank API timeout' });
  }
  res.status(201).json({ orderId: 'ord-' + Date.now(), status: 'paid', amount: 89.97 });
});

// Chaos Engineering Endpoints (for testing alerts & PromQL)
app.get('/api/slow', async (req, res) => {
  const delay = parseInt(req.query.delayMs || '1000', 10);
  await new Promise(resolve => setTimeout(resolve, delay));
  res.json({ simulated_delay_ms: delay, message: 'Slow response completed' });
});

app.get('/api/error', (req, res) => {
  res.status(500).json({
    error: 'InternalServerError',
    chaos: true,
    message: 'Simulated 500 error for Prometheus Alertmanager testing'
  });
});

// Prometheus Scrape Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Graceful Shutdown (PID 1 Safety)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Capstone Microservice listening on http://0.0.0.0:${PORT}`);
  console.log(`📊 Prometheus Metrics available at http://0.0.0.0:${PORT}/metrics`);
});

const handleShutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);
  isReady = false; // Stop accepting new K8s traffic
  server.close(() => {
    console.log('✅ Closed all active HTTP connections. Process exiting safely.');
    process.exit(0);
  });

  // Force exit after 10s timeout
  setTimeout(() => {
    console.error('⚠️ Forceful shutdown timeout exceeded. Exiting immediately.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
