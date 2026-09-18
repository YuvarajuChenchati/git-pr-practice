# 🎯 Top 20 Senior SRE & Observability Interview Q&A

### Q1: What is the difference between Monitoring and Observability?
**Answer**:
- **Monitoring** is **reactive**: It tells you *when* a predefined system failure occurs (e.g., "Is CPU > 90%?", "Is endpoint `/health` returning 200?"). It only answers questions about *known-unknowns*.
- **Observability** is an **inherent attribute of a system**: It allows you to infer the internal state of a complex system based on its external outputs (Metrics, Logs, Traces). It empowers engineers to debug *unknown-unknowns* (e.g., "Why did requests for user tier 'enterprise' slow down only when paying with Apple Pay on mobile in Frankfurt?").

---

### Q2: What is "High Cardinality" in Prometheus, and why does it crash clusters?
**Answer**:
Cardinality is the total number of unique time series created by the Cartesian product of all metric label key-value pairs.
- *Good Labels (Low Cardinality)*: `method="POST"`, `status="200"`, `environment="prod"`. (Small finite set of combinations).
- *Disastrous Labels (High Cardinality)*: `user_id="849204"`, `ip="192.168.1.5"`, `order_id="uuid"`.
If you receive 1,000,000 users, Prometheus creates 1,000,000 separate in-memory time series chunks. The TSDB index expands uncontrollably, causing Prometheus to exhaust RAM and crash with **OOMKilled**.
*Rule*: Store high-cardinality values in distributed Traces (spans) or Logs (Loki/Elastic), never in Prometheus metric labels!

---

### Q3: Explain the difference between SLI, SLO, SLA, and Error Budget.
**Answer**:
- **SLI (Service Level Indicator)**: A quantifiable metric measured in real-time (e.g. `Successful HTTP Requests / Total Requests = 99.85%`).
- **SLO (Service Level Objective)**: The internal target set by product and SRE teams (e.g. `99.90% success over 30 days`).
- **SLA (Service Level Agreement)**: The legal/financial contract with customers with financial penalties if breached (e.g. `If monthly uptime < 99.50%, refund 20%`).
- **Error Budget**: The mathematical difference $100\% - \text{SLO}$. For a 99.9% SLO, you have an allowable unreliability budget of 0.1% (43 minutes of downtime per month).

---

### Q4: Why is Average Latency a dangerous trap?
**Answer**:
Averages conceal outliers through mathematical smoothing.
If 99 requests take 10ms and 1 request takes 10,000ms:
$$\text{Average} = \frac{99 \times 10 + 10000}{100} = \frac{10990}{100} = 109.9\text{ms}$$
An average of 109ms appears acceptable on a dashboard, but 1 out of every 100 users experienced a horrific 10-second freeze!
SREs monitor **percentile quantiles (P95, P99, P99.9)** using Histograms to measure real tail latency experienced by customers.

---

### Q5: How does OpenTelemetry Context Propagation work across network boundaries?
**Answer**:
OpenTelemetry uses standard **W3C Trace Context** HTTP headers:
1. When microservice A makes an outgoing HTTP/gRPC request to microservice B, the OTel SDK automatically injects the `traceparent` header (e.g. `00-<trace-id>-<span-id>-01`).
2. Microservice B's HTTP middleware extracts this header, extracts the `trace-id`, and creates a new child span pointing to microservice A's `span-id` as its parent.
3. This creates a connected, acyclic Directed Acyclic Graph (DAG) across hundreds of microservices.

---

### Q6: What is Prometheus Pushgateway, and when should it be used?
**Answer**:
Prometheus is fundamentally **pull-based** (it scrapes HTTP `/metrics` endpoints).
However, **ephemeral batch jobs / cron jobs** might only run for 5 seconds and exit before Prometheus scrapes them.
**Pushgateway** acts as an intermediary buffer: The short-lived batch job pushes metrics to Pushgateway before exiting, and Prometheus scrapes Pushgateway on its regular 15s schedule.
*Warning*: Do not use Pushgateway for general microservices; it converts Prometheus into a push system and loses instance health detection.

---

### Q7: What are the differences between Prometheus, Grafana Mimir, and Thanos?
**Answer**:
- **Prometheus**: Single-node TSDB. Limited horizontal scaling and typically retains data for 15-30 days on local disk.
- **Thanos**: Extends Prometheus by adding sidecars that ship TSDB blocks to cheap object storage (AWS S3) for infinite long-term retention and global query deduplication.
- **Grafana Mimir**: Multi-tenant, horizontally scalable, distributed TSDB engine designed by Grafana Labs for enterprise high-volume metric ingestion (billions of active series).

---

### Q8: What is Alertmanager Inhibition?
**Answer**:
**Inhibition** is a feature where an alert suppresses (mutes) a set of other alerts if a related, higher-priority alert is already firing.
*Example*: If an entire AWS Availability Zone is down (`AZ_East_1a_Down`), Alertmanager can inhibit 300 individual alerts for missing pods, database connection timeouts, and proxy errors in that zone, preventing engineers from receiving 300 redundant notifications.

---

### Q9: How do you handle a "Flapping Alert"?
**Answer**:
A flapping alert constantly transitions between `FIRING` and `RESOLVED` every few minutes (e.g. CPU hovering around 85%).
*Solution*: Use the Prometheus `for` duration clause:
```yaml
alert: HighCpu
expr: cpu_usage > 85
for: 10m # Must remain continuously > 85% for 10 consecutive minutes before firing!
```
And configure Alertmanager `repeat_interval` to avoid re-notifying too quickly.

---

### Q10: What is a Blameless Post-Mortem?
**Answer**:
A blameless post-mortem is an incident retrospective that assumes engineers acted in good faith with the information they had.
Instead of asking *"Who made the mistake?"*, the team asks:
- *"What safeguards were missing in our automated CI/CD pipeline?"*
- *"Why didn't our canary deployment detect the regression before 100% rollout?"*
- *"How can we improve our alerting thresholds to detect this in 1 minute instead of 30 minutes?"*
Action items are converted into prioritized engineering tickets to systematically prevent recurrence.
