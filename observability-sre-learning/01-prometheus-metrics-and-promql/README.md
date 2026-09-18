# 📈 Module 01: Prometheus Metrics & PromQL

> *"You cannot improve what you do not measure.*  
> *Prometheus is the heartbeat monitor of the cloud native world."*

---

## 🎯 The 4 Prometheus Metric Types

| Metric Type | Behavior | Example | How to Query in PromQL |
|---|---|---|---|
| **1. Counter** | Cumulative value that **only increases** (or resets to 0 on restart). | `http_requests_total` | `rate(http_requests_total[5m])` (Requests per second) |
| **2. Gauge** | Numerical value that **goes up and down**. | `node_memory_Active_bytes`, `cpu_usage` | `node_memory_Active_bytes / 1024 / 1024` (Current RAM in MB) |
| **3. Histogram** | Counts events in configurable **duration buckets**. | `http_request_duration_seconds_bucket` | `histogram_quantile(0.99, rate(...[5m]))` (99th percentile latency) |
| **4. Summary** | Computes streaming quantiles (p50, p90, p99) directly on the client. | `rpc_duration_seconds` | `rpc_duration_seconds{quantile="0.99"}` |

---

## ⚡ PromQL: The Essential Query Cheatsheet

### 1. Request Rate (Requests Per Second)
```promql
sum(rate(http_requests_total{status=~"2.."}[5m])) by (service)
```

### 2. Error Rate Percentage (5xx Errors vs Total Requests)
```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) * 100
```

### 3. The Sacred P99 Latency (The User Experience Truth)
Never look at average latency! If 99 users get 10ms and 1 user gets 10,000ms, the average looks "fine" while your highest-paying customer had a terrible experience!
```promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

---

## 🧪 Real Prometheus Config in this Module
Open [`prometheus.yml`](./prometheus.yml) to inspect a production Prometheus scraper configuration!
