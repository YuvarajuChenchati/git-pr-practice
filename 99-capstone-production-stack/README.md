# 🎓 Capstone Production Stack: The End-to-End DevOps Lifecycle

Welcome to the **Unified DevOps Capstone Project**. This hands-on stack proves how all 5 pillars connect together in a real-world production system:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Docker Build │ ────▶ │ 2. CI/CD & Scan │ ────▶ │ 3. K8s / Deploy │
│ Multi-Stage PID1│       │  Trivy CVE Pass │       │   HPA & Probes  │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 5. SRE Alerts   │ ◀──── │ 5. Prometheus   │ ◀──── │ 5. Expose Metrics│
│ Alertmanager P99│       │   Scrape Loop   │       │    /metrics     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 🚀 Quickstart: Running the Capstone Stack Locally

### 1. Start the Microservice, Prometheus, and Grafana
Run inside this directory:
```powershell
docker compose up --build -d
```

### 2. Verify Running Containers
```powershell
docker compose ps
```
You will see three containers running:
- `capstone-node-app` on `http://localhost:3000`
- `capstone-prometheus` on `http://localhost:9090`
- `capstone-grafana` on `http://localhost:3001`

### 3. Generate Traffic & Chaos
Run the included traffic generator script in PowerShell:
```powershell
# Normal traffic:
.\simulate-traffic.ps1 -TotalRequests 50 -DelayMs 100

# Chaos mode (injects latency spikes and 500 errors to test Prometheus alerts):
.\simulate-traffic.ps1 -TotalRequests 100 -DelayMs 150 -Chaos
```

---

## 📊 Live Observability Dashboards

1. **App Health & Diagnostic Endpoint**:
   - `http://localhost:3000/`
   - `http://localhost:3000/healthz`
   - `http://localhost:3000/metrics` (Prometheus raw format)

2. **Prometheus Target Status**:
   - Open `http://localhost:9090/targets` in your browser.
   - Verify `capstone-node-app` shows state **UP (1/1)**.

3. **PromQL Queries to Try in Prometheus (`http://localhost:9090/graph`)**:
   - **Request Rate (RPS)**:
     ```promql
     sum(rate(http_requests_total[1m]))
     ```
   - **Error Rate (5xx %)**:
     ```promql
     sum(rate(http_requests_total{code=~"5.."}[1m])) / sum(rate(http_requests_total[1m])) * 100
     ```
   - **P95 Latency**:
     ```promql
     histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[2m])) by (le))
     ```

4. **Grafana Visualization**:
   - Open `http://localhost:3001` (Auto-logs in as Admin).
   - Add Prometheus as a Data Source with URL: `http://prometheus:9090`.
   - Create a dashboard to visualize the Four Golden Signals (Latency, Traffic, Errors, Saturation).

---

## 🧹 Tear Down
When finished, stop and remove containers and volumes:
```powershell
docker compose down -v
```
