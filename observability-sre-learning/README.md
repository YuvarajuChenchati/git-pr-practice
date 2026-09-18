# 📊 Observability, Monitoring & SRE Mastery: Prometheus, Grafana & OpenTelemetry

> *"If a server crashes in a datacenter and no monitoring system alerts you, did your business still lose $50,000?"*  
> — First Law of Site Reliability Engineering (SRE) 🚨

Welcome to the **complete, hands-on, storytelling-driven Observability & SRE curriculum**!
This repository covers the final, crowning discipline of the DevOps & Cloud Engineering journey:
**Docker (Containerize) ➔ Kubernetes (Orchestrate) ➔ Terraform (Provision) ➔ CI/CD & GitOps (Automate) ➔ Observability & SRE (Monitor & Guard).**

---

## 🌟 Quick Start: Launch the Interactive Observability & SRE Hub!

Experience live production telemetry visually with our **Interactive Observability Hub**:
- 🧪 **Live Telemetry & Metrics Simulator**:
  - **Real-Time Metrics**: Live Requests Per Second (RPS), P99 Latency percentiles, and Memory gauges.
  - **Live Log Stream**: Color-coded JSON logs (`INFO`, `WARN`, `ERROR`).
  - **Distributed Tracing Waterfall**: Inspect request latency across microservices (`Nginx ➔ Auth API ➔ PostgreSQL`).
- ⚡ **Click "Simulate Traffic Spike (10,000 RPS)"**: Watch P99 latency surge and Prometheus auto-alert!
- 💥 **Click "Simulate Memory Leak"**: Watch container RAM climb toward 512MB threshold until an OOM alert fires!
- 🚨 **Click "Trigger Alertmanager Firing"**: Watch Prometheus Alertmanager route firing alerts to Slack/PagerDuty!
- 📖 **Story Mode**: The Blind Flight Disaster, The 3 Pillars (Metrics, Logs, Traces), The Google SRE Four Golden Signals, and Error Budgets (SLI / SLO / SLA).
- 🎮 **Disaster Recovery Quiz Arena**: P99 vs Average latency traps, alert fatigue remediation, high cardinality metric blowouts.
- 💻 **Visual PromQL Generator**: Interactive time-series query builder for Prometheus.

👉 **Open in Browser**:
```text
file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/interactive-hub/index.html
```
Or open [`observability-sre-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/interactive-hub/index.html).

---

## 🗺️ The Complete Observability & SRE Curriculum

| Module | Core Concepts Mastered | Real Working Manifests |
|---|---|---|
| **01** | [**Prometheus Metrics & PromQL**](./01-prometheus-metrics-and-promql/) | Pull-based metrics scraping, The 4 Metric Types (Counter, Gauge, Histogram, Summary), PromQL syntax | [`prometheus.yml`](./01-prometheus-metrics-and-promql/prometheus.yml) |
| **02** | [**Grafana Dashboards & Visualization**](./02-grafana-dashboards-and-visualization/) | Golden signals dashboards, visualizing Kubernetes nodes & pods, Dashboard as Code (JSON export) | [`dashboard-k8s-cluster.json`](./02-grafana-dashboards-and-visualization/dashboard-k8s-cluster.json) |
| **03** | [**Distributed Tracing & OpenTelemetry**](./03-distributed-tracing-opentelemetry/) | The OpenTelemetry (OTel) standard, Traces, Spans, Context propagation (`traceparent`), Finding latency bottlenecks | [`otel-tracer-example.js`](./03-distributed-tracing-opentelemetry/otel-tracer-example.js) |
| **04** | [**Alerting & SRE Practices**](./04-alerting-and-sre-practices/) | Alertmanager routing, Deduplication, Inhibition, SLI (Indicators), SLO (Objectives), Error Budgets | [`alert-rules.yaml`](./04-alerting-and-sre-practices/alert-rules.yaml) |
| **05** | [**SRE Troubleshooting & Interview Playbook**](./05-interview-and-sre-playbook/) | High cardinality traps, P99 vs Average fallacy, Alert fatigue remediation, Top 20 Senior SRE Interview Q&A | [`senior-interview-prep.md`](./05-interview-and-sre-playbook/senior-interview-prep.md) |

---

## 💡 The Core Mental Model: The 3 Pillars of Observability

```
                               THE 3 PILLARS OF OBSERVABILITY
                                             │
           ┌─────────────────────────────────┼─────────────────────────────────┐
           │                                 │                                 │
           ▼                                 ▼                                 ▼
   ┌───────────────┐                 ┌───────────────┐                 ┌───────────────┐
   │    METRICS    │                 │     LOGS      │                 │    TRACES     │
   │  (Prometheus) │                 │(Grafana Loki) │                 │(OpenTelemetry)│
   └───────┬───────┘                 └───────┬───────┘                 └───────┬───────┘
           │                                 │                                 │
           ▼                                 ▼                                 ▼
"Is the system burning?"          "Why did it burn?"               "Where in the maze did"
(Numeric time-series data:        (Timestamped error text:          it slow down?"
 CPU %, Memory, 5xx Count)         Stack traces, exceptions)        (Request lifecycle)
```

1. **Metrics tell you THAT something is wrong** (e.g. HTTP 500 error rate spiked to 12%).
2. **Traces tell you WHERE it is wrong** (e.g. `PaymentGateway` microservice took 8,400ms).
3. **Logs tell you WHY it is wrong** (e.g. `NullPointerException: Stripe API key expired`).
