# 🕸️ Module 03: Distributed Tracing & OpenTelemetry (OTel)

> *"In a monolithic app, stack traces are easy.*  
> *In a microservice mesh of 50 services, finding which service added 3,000ms is impossible without Distributed Tracing."*

---

## 🔍 The Need for Traces: The Needle in the Haystack

Imagine a user clicks **"Checkout"**:
```
User Click ──▶ Nginx Proxy ──▶ Auth API ──▶ Cart Service ──▶ Payment API ──▶ PostgreSQL
(Total: 4.8 seconds! User is furious!)
```
- The logs in Nginx show: `200 OK (4800ms)`.
- The logs in Cart Service show: `200 OK`.
- **WHICH SERVICE CAUSED THE SLOWDOWN?**
Without distributed tracing, your engineers spend 3 days guessing and arguing in Slack.

---

## 🧭 The OpenTelemetry (OTel) Standard

OpenTelemetry injects an HTTP Header into every outgoing request:
```text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
              │                  │                               │
           Version            Trace ID                        Span ID
```

1. **Trace**: The entire end-to-end journey of the request (has 1 unique Trace ID).
2. **Span**: A single unit of work done by one microservice (e.g. `Execute SQL Query: SELECT * FROM orders`).
3. **Waterfall Visualization**: In Jaeger or Grafana Tempo, you see the exact timeline:
   - `Nginx`: 15ms
   - `Auth API`: 25ms
   - `Cart Service`: 10ms
   - `Payment API`: **4,200ms (FOUND THE BOTTLENECK!)**

---

## 🧪 Real Code in this Module
Open [`otel-tracer-example.js`](./otel-tracer-example.js) to see how OpenTelemetry SDK instruments a service with parent-child spans!
