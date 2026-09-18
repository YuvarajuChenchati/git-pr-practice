# 🌐 Module 04: Services & Ingress — The Kubernetes Traffic Matrix

> *"Pods are born, they live, they die, and their IP addresses are recycled like discarded phone numbers.*  
> *Never connect directly to a Pod IP."*

---

## 💥 The Problem: The Volatile Pod IP

Suppose you have an API that connects to a database pod at IP `10.244.2.14`.
If the database pod crashes and restarts, it is assigned a new IP: `10.244.1.88`!
Your API immediately throws connection errors.

### 🛡️ The Solution: The Kubernetes Service
A **Service** is a permanent, static abstraction placed in front of a dynamic group of pods:
- It gets a stable **Virtual IP (ClusterIP)** that NEVER changes.
- It gets a permanent internal DNS name: `http://my-service`.
- It tracks healthy pods using **Label Selectors** (`selector: app: web`).
- It automatically load-balances incoming traffic across all healthy pods!

---

## 🚦 The 4 Types of Kubernetes Services

| Service Type | What It Does | When To Use |
|---|---|---|
| **ClusterIP (Default)** | Gives an internal-only IP accessible **strictly inside** the cluster. | Databases, internal microservices, Redis caches. |
| **NodePort** | Opens a static high-numbered port (`30000-32767`) on **every worker node's** physical IP. | Local development, testing on bare-metal servers. |
| **LoadBalancer** | Integrates with AWS/GCP/Azure to provision a real cloud load balancer (e.g. AWS ALB/NLB). | Exposing critical production workloads directly. |
| **Ingress Controller** | An intelligent reverse proxy (like Nginx/Envoy) that routes external HTTP/HTTPS traffic to multiple internal services based on path (`/api`) or domain (`api.myapp.com`). | The production standard for web applications! |

```
                                [ THE INTERNET ]
                                        │
                                        ▼
                           ┌─────────────────────────┐
                           │   Cloud Load Balancer   │
                           └────────────┬────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   Ingress Controller (Nginx)  │
                        └───────┬───────────────┬───────┘
                                │               │
          Path: /               │               │ Path: /api
                                ▼               ▼
                    ┌────────────────┐    ┌────────────────┐
                    │ Frontend Svc   │    │ Backend API Svc│
                    │ (ClusterIP)    │    │ (ClusterIP)    │
                    └───────┬────────┘    └───────┬────────┘
                            │                     │
                ┌───────────┴───────────┐         │
                ▼                       ▼         ▼
          [ Pod: Web 1 ]          [ Pod: Web 2 ] [ Pod: API 1 ]
```

---

## 🧪 Real Hands-on Manifests

### 1. Internal ClusterIP Service
Open [`service-clusterip.yaml`](./service-clusterip.yaml):
```bash
kubectl apply -f service-clusterip.yaml
kubectl get svc
```
You will receive a permanent internal IP (e.g. `10.96.14.200`). Any pod in the cluster can now simply do:
```bash
curl http://backend-service:80
```
Kubernetes CoreDNS translates `backend-service` to that IP automatically!

### 2. Exposing to Your Local Machine (NodePort or Port-Forward)
Want to access the service from Chrome on Windows?
```bash
# Option A: Instant Port-Forward Tunnel
kubectl port-forward svc/backend-service 8080:80

# Now open http://localhost:8080 in your browser!
```

### 3. Layer 7 Ingress Routing
Open [`ingress-routing.yaml`](./ingress-routing.yaml) to see how paths like `/api` and `/` route to completely different microservices.
