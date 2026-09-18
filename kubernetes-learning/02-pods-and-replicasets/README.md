# 🫛 Module 02: Pods & ReplicaSets — The Atoms of Kubernetes

> *"Why can't Kubernetes just run a container directly? Why do we need a Pod?"*  
> — Every developer on Day 1.

---

## 🫛 The Pea Pod Analogy: Why Pods Exist

In biology, a **pea pod** can hold 1, 2, or 3 peas together.
In Kubernetes:
- A **Pod** is the smallest deployable unit in the cluster.
- Most pods hold just **1 container** (e.g., your Node.js API).
- But sometimes, two containers are so intimately coupled that they must share the exact same filesystem, network, and loopback (`localhost`).

```
+-------------------------------------------------------------+
|                          POD (Pea Pod)                      |
|  IP Address: 10.244.1.45 (Shared by all containers in Pod!) |
|                                                             |
|   ┌─────────────────────────┐   ┌────────────────────────┐  |
|   │ Primary Container       │   │ Sidecar Container      │  |
|   │ (Express REST API)      │   │ (Log Shipper / Envoy)  │  |
|   │ Port: 3000              │   │ Port: 9090             │  |
|   └────────────┬────────────┘   └───────────┬────────────┘  |
|                │                            │               |
|                ▼                            ▼               |
|   Shared Network Namespace (`localhost:3000` visible to both)
|   Shared Storage Volumes (`/var/logs`)                      |
+-------------------------------------------------------------+
```

### The Sidecar Pattern (Real World Example):
Imagine your Express API writes logs to `/var/logs/app.log`.
Instead of bundling Datadog or Prometheus telemetry code into your Node.js application, you deploy a tiny **Sidecar Container** (like Fluentbit or Envoy) in the same Pod:
- The Sidecar reads the shared log volume and ships metrics to AWS CloudWatch.
- Your Node app stays 100% clean and focused on business logic!

---

## ⚠️ Naked Pods vs Managed Pods (The Mortality Law)

> **CRITICAL RULE**: Never create naked pods in production (`kind: Pod`)!

Why?
- If you run `kubectl apply -f pod-demo.yaml` and a worker node crashes, **THE POD IS GONE FOREVER**.
- Naked pods have **zero self-healing**. Kubernetes will NOT recreate a naked pod.

### 🛡️ The ReplicaSet: Desired State Enforcer
To give pods eternal life, we wrap them in a **ReplicaSet**:
- You declare: `replicas: 3`.
- ReplicaSet matches pods using **Label Selectors** (`matchLabels: app: diag-api`).
- If you manually delete one pod:
  ```bash
  kubectl delete pod <pod-id>
  ```
  The ReplicaSet controller notices: *"I only have 2 pods, but the boss wants 3!"* It instantly commands Kubelet to schedule a 3rd pod.

---

## 🧪 Hands-On Manifests & Terminal Walkthrough

### Step 1: Inspect the Naked Pod Manifest
Open [`pod-demo.yaml`](./pod-demo.yaml):
```bash
kubectl apply -f pod-demo.yaml
kubectl get pods
```

### Step 2: Test Container Forensics
```bash
# Stream live logs
kubectl logs -f diag-pod

# Execute an interactive shell inside the pod
kubectl exec -it diag-pod -- sh

# View detailed pod lifecycle events (scheduling, pulling image, probe status)
kubectl describe pod diag-pod
```

### Step 3: Run the Self-Healing ReplicaSet
Open [`replicaset-demo.yaml`](./replicaset-demo.yaml):
```bash
kubectl apply -f replicaset-demo.yaml
kubectl get pods -l app=diag-api
```
Notice 3 pods are running!

### Step 4: The Chaos Experiment (Kill a Pod!)
```bash
# Delete one of the pods
kubectl delete pod <one-of-the-pod-names>

# Immediately check pod list:
kubectl get pods -l app=diag-api
```
Look at the `AGE` column: you will see the terminated pod being replaced by a brand-new pod created **2 seconds ago**!
That is Kubernetes self-healing in action!
