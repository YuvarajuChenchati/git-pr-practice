# 🚨 Module 04: Alerting & SRE Practices (SLIs, SLOs & Error Budgets)

> *"If an alert wakes you up at 3 AM and there is nothing you can immediately do to fix it,*  
> *that alert should not be an alert. It should be an email."*  
> — Google SRE Book Principle 📖

---

## 😫 The Alert Fatigue Nightmare

When monitoring is configured poorly:
- Engineers get 40 PagerDuty notifications a night for temporary 85% CPU spikes that resolve themselves in 20 seconds.
- Engineers become numb and mute Slack channels.
- When a REAL catastrophic database outage occurs, nobody notices because it was lost in the noise!

### The SRE Golden Rule of Alerting:
> **Alert on Symptoms affecting Users, not on Internal Causes.**  
> Don't page an engineer because *"Disk is at 81%"*.  
> Page an engineer because *"Payment API Error Rate is 5.2% and users cannot checkout!"*

---

## 🎯 The SRE Trinity: SLI, SLO, SLA & Error Budgets

```
┌─────────────────────────────────────────────────────────────┐
│                 THE SRE HIERARCHY OF TRUTH                  │
│                                                             │
│   1. SLI (Indicator)  ➔ What is happening right now?       │
│                         "99.82% of requests returned < 200ms"│
│                                                             │
│   2. SLO (Objective)  ➔ What is our team's target?          │
│                         "99.90% over a rolling 30-day window"│
│                                                             │
│   3. SLA (Agreement)  ➔ What is the legal contract?         │
│                         "If < 99.5%, refund customer 20%"   │
│                                                             │
│   4. ERROR BUDGET     ➔ 100% - SLO = 0.10% Allowed Downtime │
│                         (43.2 minutes per month!)           │
└─────────────────────────────────────────────────────────────┘
```

### The Error Budget Innovation:
- If you have **remaining Error Budget**, developers are allowed to deploy experimental features rapidly.
- If your Error Budget is **burned to 0%**, all feature deployments are **frozen**! The entire engineering team must focus 100% on reliability, testing, and bug fixes until the budget recovers!

---

## 🧪 Real Alert Rules in this Module
Open [`alert-rules.yaml`](./alert-rules.yaml) to inspect production Prometheus alerting rules for error spikes, high latency, and memory saturation!
