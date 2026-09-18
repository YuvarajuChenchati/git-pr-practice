# 📊 Module 02: Grafana Dashboards & The Four Golden Signals

> *"A dashboard with 50 unorganized graphs is not monitoring. It is visual noise.*  
> *Design dashboards around the Four Golden Signals."*

---

## 🏆 The Google SRE Four Golden Signals

Every production service dashboard must answer these 4 questions:

```
┌─────────────────────────────────────────────────────────────┐
│                 THE FOUR GOLDEN SIGNALS                     │
│                                                             │
│   1. LATENCY     ➔ How long does it take to serve requests? │
│                    (Always track P99, P95, and P50!)        │
│                                                             │
│   2. TRAFFIC     ➔ How much demand is on your system?       │
│                    (Requests per second - RPS)              │
│                                                             │
│   3. ERRORS      ➔ What percentage of requests are failing? │
│                    (HTTP 5xx rate, DB timeout errors)       │
│                                                             │
│   4. SATURATION  ➔ How full is your service?                │
│                    (CPU %, RAM %, DB Connection pool %)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Dashboard as Code
Open [`dashboard-k8s-cluster.json`](./dashboard-k8s-cluster.json) to inspect a ready-to-import Grafana dashboard model with dark-mode panels, PromQL queries, and threshold alerts!
