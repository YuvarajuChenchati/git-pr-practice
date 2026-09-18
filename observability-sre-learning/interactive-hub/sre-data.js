// Observability, Monitoring & SRE Interactive Mastery Data: Stories, Telemetry & Quiz
window.SRE_DATA = {
  stories: [
    {
      id: "ch1-blind-flight",
      title: "Episode 1: The Blind Flight Disaster (Flying Without Gauges)",
      tagline: "How a major airline website crashed for 6 hours because nobody knew the database was out of connections.",
      memeUrl: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      memeCaption: "DevOps looking at empty dashboards: 'I am sure everything is totally fine!'",
      content: `
### ✈️ The Cockpit Analogy
Imagine flying a Boeing 747 through dense fog at 30,000 feet:
- What if the altimeter was broken?
- What if there was no fuel gauge?
- What if the airspeed indicator was missing?
You would crash within 10 minutes.

Yet in 2015, major companies ran multi-million-dollar software systems **completely blind**:
- Servers ran out of memory silently.
- Database connection pools exhausted.
- **The only monitoring system was angry tweets from customers saying 'Your site is down!'**

---

### 🛡️ The Observability Revolution
True Observability gives you:
1. **Metrics**: Real-time instrument gauges (RPS, Latency, Saturation).
2. **Logs**: Timestamped flight black-box recordings.
3. **Traces**: GPS tracking of every single passenger request through the cloud.
      `,
      takeaways: [
        "Running production without observability is flying a plane blind.",
        "Your customers should never be your monitoring system.",
        "Proactive alerts allow SREs to resolve incidents before users notice degradation."
      ]
    },
    {
      id: "ch2-three-pillars",
      title: "Episode 2: The Three Pillars — Metrics, Logs & Distributed Traces",
      tagline: "How the Holy Trinity of telemetry works together to pinpoint bugs in seconds.",
      memeUrl: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
      memeCaption: "SRE inspecting the exact 240ms database span inside an OpenTelemetry trace waterfall.",
      content: `
### 🔍 How The 3 Pillars Cooperate During An Outage

\`\`\`
1. METRICS (Prometheus) ➔ "THAT it happened"
   Alert fires: "HTTP 500 error rate spiked from 0.01% to 8.4% in us-east-1!"
          │
          ▼
2. TRACES (OpenTelemetry) ➔ "WHERE it happened"
   Waterfall graph shows: Request #98124 spent 4,200ms inside 'PaymentGatewayService'.
          │
          ▼
3. LOGS (Grafana Loki) ➔ "WHY it happened"
   Detailed log: "StripeConnectionTimeoutException: API key expired at 14:02 UTC."
\`\`\`

Instead of 4 hours of panicking on Zoom, the root cause is isolated and patched in **90 seconds**!
      `,
      takeaways: [
        "Metrics detect symptoms at high speed with low overhead.",
        "Distributed traces isolate the bottleneck service in microservice meshes.",
        "Logs provide exact stack traces and contextual error messages."
      ]
    },
    {
      id: "ch3-golden-signals",
      title: "Episode 3: The Four Golden Signals (Google SRE Book)",
      tagline: "The only 4 numbers that matter when evaluating the health of any web application.",
      memeUrl: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeCaption: "Google SRE: 'If your dashboard does not show the Four Golden Signals, redesign it.'",
      content: `
### 🏆 The 4 Numbers Every SRE Monitors

#### 1. Latency (The Speed)
The time it takes to service a request.
*Rule*: Separate successful request latency from failed request latency (a fast 500 error is not good latency!).

#### 2. Traffic (The Demand)
How much demand is on your system (e.g. Requests Per Second - RPS).

#### 3. Errors (The Correctness)
The rate of requests that fail (e.g. HTTP 5xx codes or dropped sockets).

#### 4. Saturation (The Capacity)
How full your service is (e.g. CPU 85%, RAM 92%, Database pool 98/100).
*Rule*: Most services degrade severely before reaching 100% saturation.
      `,
      takeaways: [
        "Latency, Traffic, Errors, and Saturation are the universal health indicators.",
        "Always monitor tail latency (P99) rather than misleading averages.",
        "Saturation warns you of impending failure before errors begin occurring."
      ]
    },
    {
      id: "ch4-alert-fatigue",
      title: "Episode 4: The 3 AM Alert Fatigue Nightmare",
      tagline: "Why receiving 50 notifications a night destroys engineering teams and how to fix it.",
      memeUrl: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
      memeCaption: "On-call engineer waking up to 48 PagerDuty alerts for a 2% CPU fluctuation.",
      content: `
### 😫 The Cry-Wolf Effect
If an on-call engineer receives 30 false alarms a week:
- They silence alerts or snooze notifications.
- Burnout rates skyrocket.
- When an actual catastrophic database failure happens, **nobody reacts**.

---

### 🛡️ The Remediation Rules:
1. **Never alert on internal causes** (e.g. *"CPU is at 82%"*).
2. **Alert on user-facing symptoms** (e.g. *"P99 latency > 1.5s for 3 minutes"*).
3. **Every alert must be ACTIONABLE**: If an engineer cannot do anything to fix it, it should not page them!
      `,
      takeaways: [
        "Alert fatigue causes critical real outages to be ignored.",
        "Alert on symptoms affecting users, not temporary CPU spikes.",
        "Use Alertmanager grouping and inhibition to silence alert storms."
      ]
    },
    {
      id: "ch5-error-budgets",
      title: "Episode 5: Error Budgets & The Art of Reliability",
      tagline: "How Google and Netflix balance shipping features fast without breaking 99.99% uptime.",
      memeUrl: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeCaption: "Developers realizing they burned their Error Budget, so feature deploys are frozen.",
      content: `
### ⚖️ The Eternal War: Devs vs Ops
- **Developers** want to ship new features fast.
- **Operations** want 100% stability and zero changes.
How do you solve this tension?

### 💰 The Error Budget Compromise
- 100% reliability is impossible and too expensive.
- An SLO of **99.9%** gives you an **Error Budget of 0.1% unreliability** (~43 minutes a month).
- **The Golden Rule**:
  - If your Error Budget is healthy (> 0%): Developers can deploy new features freely.
  - If your Error Budget is **burned to 0%**: **ALL DEPLOYMENTS ARE FROZEN!** The entire engineering team must focus on bug fixes, testing, and reliability until the budget recovers!
      `,
      takeaways: [
        "100% uptime is an anti-pattern: it slows down innovation unnecessarily.",
        "Error budgets objectively balance speed of delivery with reliability.",
        "Burning your error budget triggers automated deployment freezes."
      ]
    }
  ],

  // Quiz Arena Data
  quizChallenges: [
    {
      id: 1,
      title: "The High Cardinality Explosion",
      scenario: "A developer adds `user_id` as a label in Prometheus: `http_requests_total{user_id=\"98214\"}`. Within 2 hours, Prometheus consumes 32GB of RAM and crashes with OOMKilled. Why did this happen?",
      memeCorrect: "https://media.giphy.com/media/2bYewTk7K2No1NvcuK/giphy.gif",
      memeWrong: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      options: [
        "Prometheus has a bug with integer parsing.",
        "High Cardinality: Every unique `user_id` generates a brand new in-memory time series! With 1,000,000 users, Prometheus creates 1,000,000 time series, exhausting RAM! High-cardinality data belongs in Logs or Traces, never metric labels!",
        "The Prometheus disk was corrupted.",
        "Node.js sent corrupted metrics."
      ],
      correctIndex: 1,
      explanation: "Cardinality is the total number of unique time series. Adding high-cardinality labels (User IDs, UUIDs, timestamps, IP addresses) causes combinatorial explosion, exhausting TSDB memory! Always keep Prometheus labels bounded to small finite sets (e.g. status code, method, service)!"
    },
    {
      id: 2,
      title: "The Average Latency Trap",
      scenario: "Your dashboard shows 'Average Latency: 48ms'. Management is pleased, but customer support reports that top enterprise clients are complaining that pages take 15 seconds to load. How could this happen?",
      memeCorrect: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      options: [
        "Customer support is mistaken.",
        "The Average Latency fallacy: If 99 requests take 5ms and 1 request takes 15,000ms, the average is ~150ms. Averages conceal tail latency! SREs must always monitor and alert on P95 and P99 percentiles calculated via Histograms!",
        "The network switch has an issue on odd-numbered days.",
        "The database is deleting metrics."
      ],
      correctIndex: 1,
      explanation: "Averages smooth out and hide extreme outliers! If 1% of your traffic experiences a 15-second freeze, your highest-paying enterprise users are suffering while your average looks healthy. Always monitor and alert on P95 and P99 percentiles!"
    },
    {
      id: 3,
      title: "The 3 AM Flapping Alert",
      scenario: "Every night, an alert `HighCPUUtilization` fires at 3:02 AM, resolves at 3:04 AM, fires again at 3:06 AM, and resolves at 3:08 AM, paging the on-call engineer 4 times. What is the root cause and fix?",
      memeCorrect: "https://media.giphy.com/media/l4pMattUYTTM7qpIk/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      options: [
        "Delete the CPU alert completely.",
        "Flapping alert: CPU is hovering right around the threshold. Add a `for: 10m` clause to the Prometheus rule so the condition must remain true continuously for 10 minutes before paging!",
        "Increase the server CPU to 128 cores.",
        "Mute PagerDuty forever."
      ],
      correctIndex: 1,
      explanation: "Adding a `for` duration (e.g. `for: 10m`) prevents flapping alerts by requiring the metric to stay breached continuously for a sustained duration before triggering a page, preventing transient spikes from waking engineers!"
    },
    {
      id: 4,
      title: "SLI vs SLO vs SLA",
      scenario: "During an SRE architectural review, you are asked: 'What is the difference between an SLO and an SLA?' How do you answer?",
      memeCorrect: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      memeWrong: "https://media.giphy.com/media/11StaZ9Lj75oCY/giphy.gif",
      options: [
        "They are identical terms for the same concept.",
        "An SLO is an internal reliability target set by engineering (e.g. 99.9%). An SLA is the external legal contract with customers with financial penalties if breached (e.g. 99.5%). SLOs are always stricter than SLAs!",
        "An SLA is for frontend apps, while an SLO is for databases.",
        "An SLO is set by AWS, while an SLA is set by Google."
      ],
      correctIndex: 1,
      explanation: "Your internal SLO (e.g. 99.9%) is always stricter than your external legal SLA (e.g. 99.5%). This provides a safety buffer so internal alarms fire and issues are fixed before you breach your legal customer contract and owe refunds!"
    },
    {
      id: 5,
      title: "The Distributed Tracing Needle",
      scenario: "In a microservice architecture with 40 services, a user checkout fails with a 504 Gateway Timeout. Nginx logs show a timeout, but all 40 microservice logs show normal operation. How do you find the failing link?",
      memeCorrect: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xThuW4BaAA2f7nRvoc/giphy.gif",
      options: [
        "Restart all 40 microservices simultaneously.",
        "Search the trace ID in Jaeger / Grafana Tempo. The OpenTelemetry trace waterfall displays every span duration and immediately reveals which child service hung or failed!",
        "Add more memory to Nginx.",
        "Look at CPU metrics on the worker nodes."
      ],
      correctIndex: 1,
      explanation: "Distributed tracing passes a unique Trace ID across every network hop via HTTP headers (`traceparent`). Looking at the trace waterfall instantly pinpoints which microservice span hung or failed, eliminating guesswork!"
    }
  ],

  // Distributed Trace Waterfall Sample
  traceWaterfall: [
    { name: "HTTP GET /api/v1/checkout", service: "nginx-ingress", duration: "297ms", width: "100%", offset: "0%", status: "200 OK" },
    { name: "RPC ValidateSession", service: "auth-service", duration: "45ms", width: "15%", offset: "5%", status: "200 OK" },
    { name: "HTTP POST /charge", service: "payment-api", duration: "240ms", width: "80%", offset: "20%", status: "200 OK (Slow)" },
    { name: "SQL SELECT balance FROM accounts", service: "postgres-db", duration: "210ms", width: "70%", offset: "25%", status: "Slow Query (> 200ms)" }
  ]
};
