# 🩺 Module 05: Troubleshooting & Senior SRE Interview Playbook

> *"In an interview, any engineer can explain what CPU usage is.*  
> *A Senior Site Reliability Engineer (SRE) explains how to design SLOs that balance feature velocity with five-nines uptime."*

---

## 🚨 The 5 Classic Observability Disasters

| Incident | Root Cause | Fix & Best Practice |
|---|---|---|
| **1. High Cardinality Metric Explosion** | Developer put `user_id` or `email` as a label in Prometheus: `http_requests_total{user_id="1284"}`. Millions of unique time series crashed Prometheus memory! | Never use high-cardinality values (User IDs, UUIDs, timestamps) as Prometheus labels! Use them in Logs or Traces only! |
| **2. Alert Storming / Cascading Pages** | An AWS datacenter switch dies, triggering 800 separate alerts for every single microservice pod. | Use Alertmanager **Inhibition** and **Grouping**: If `ClusterDown` fires, automatically silence all child pod alerts! |
| **3. The Average Latency Illusion** | Average latency is 50ms, but 1% of users experience 12,000ms timeouts. Management thinks performance is great while VIP users churn. | Always monitor and alert on **P95, P99, and P99.9 quantiles** calculated via Histograms. |
| **4. Broken Distributed Context** | A microservice received a request with a `traceparent` header, but forwarded an outgoing HTTP request without attaching the header. | Ensure all HTTP/gRPC clients use automatic OpenTelemetry instrumentation to propagate context across every network hop. |
| **5. Clock Drift / Desynchronization** | Servers in cluster have unsynchronized system clocks; distributed trace spans appear to finish before they started! | Run Network Time Protocol (NTP / `chrony`) on all Kubernetes worker nodes to keep clocks synchronized to within milliseconds. |

---

## 📚 Guides in this Module
- [`senior-interview-prep.md`](./senior-interview-prep.md): Top 20 Senior SRE & Observability Interview Q&As covering Mimir/Cortex, OpenTelemetry collectors, Error Budget policies, and incident post-mortems.
