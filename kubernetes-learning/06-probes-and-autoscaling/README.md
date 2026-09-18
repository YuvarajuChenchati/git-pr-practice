# 🩺 Module 06: Probes & Auto-Scaling (HPA)

> *"If you don't configure readiness probes, your users will be the ones testing if your pods are ready."*

---

## 🩺 The 3 Probes: Liveness, Readiness & Startup

When Kubernetes starts a container, it assumes the container is immediately ready to accept HTTP traffic.
**Reality**: Node.js, Spring Boot, or Django might take 20 seconds to connect to the database, compile templates, and warm up caches!
If traffic hits it during those 20 seconds, users get `502 Bad Gateway`.

| Probe | Question It Answers | What K8s Does If It Fails |
|---|---|---|
| **Readiness Probe** | *"Are you ready to accept traffic right now?"* | Removes Pod IP from Service load balancer so users **never** get errors. |
| **Liveness Probe** | *"Are you alive or stuck in an infinite deadlock?"* | Kills and restarts the container to recover. |
| **Startup Probe** | *"Are you still doing slow legacy bootup?"* | Disables liveness checks until initial startup succeeds. |

---

## 📈 Horizontal Pod Autoscaling (HPA)

Instead of manually typing `kubectl scale deployment --replicas=20` during Black Friday:
- The **Metrics Server** monitors real-time CPU and Memory consumption.
- You define an HPA rule:
  ```yaml
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  ```
- When average CPU across pods hits 71%, Kubernetes automatically spins up new pods!
- When traffic subsides, it gracefully scales them back down to save cloud budget.

---

## 🧪 Hands-On Manifests

1. **Deploy Hardened Probes & Resource Limits**:
   ```bash
   kubectl apply -f probes-and-limits.yaml
   kubectl describe deployment hardened-app
   ```
2. **Apply Auto-Scaler**:
   ```bash
   kubectl apply -f hpa.yaml
   kubectl get hpa
   ```
