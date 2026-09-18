# ☸️ Kubernetes (K8s) Mastery: From Docker to Cluster Orchestration

> *"Docker built the brick. Kubernetes builds and governs the entire smart city."*  
> — Modern Cloud Platform Engineering Rule

Welcome to the **complete, hands-on, storytelling-driven Kubernetes curriculum**!
This repository bridges the gap between running single Docker containers on your laptop and managing self-healing, auto-scaling microservice fleets in production.

---

## 🌟 Quick Start: Launch the Interactive K8s Learning Hub & Simulator!

Experience Kubernetes concepts visually with our **Interactive Kubernetes Cluster Lab**:
- 🧪 **Live Self-Healing Simulator**: 1 Control Plane + 3 Worker Nodes. Click **"Kill Pod"** or **"Crash Worker Node"** and watch K8s resurrect replacements in milliseconds!
- 🔄 **Rolling Update Visualizer**: Watch pods transition from `v1` to `v2` with zero dropped requests.
- 📖 **Story Mode**: The Google Borg origin story, the Control Plane brain vs Worker Node muscle, and disaster recoveries.
- 🎮 **Disaster Recovery Quiz Arena**: Solve `CrashLoopBackOff`, `ImagePullBackOff`, and `OOMKilled` incidents with memes and debriefs.
- ⚡ **Kubectl Command Generator**: Visual flag builder for `kubectl run`, `kubectl get`, `kubectl logs`, and `kubectl rollout`.

👉 **Open in Browser**:
```text
file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/interactive-hub/index.html
```
Or open [`kubernetes-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/interactive-hub/index.html).

---

## 🗺️ The Complete Kubernetes Mastery Curriculum

| Module | Core Concepts | Hands-On Manifests & Labs |
|---|---|---|
| **01** | [**Architecture & Mental Models**](./01-k8s-architecture/) | The Borg Story, Control Plane (API Server, etcd, Scheduler, Controllers) vs Worker Nodes (Kubelet, Kube-Proxy) | Cluster setup (Docker Desktop K8s / Minikube) & cluster verification |
| **02** | [**Pods & ReplicaSets**](./02-pods-and-replicasets/) | The Pea Pod Analogy, Sidecar Pattern, Naked Pods vs Desired State Reconciliation | [`pod-demo.yaml`](./02-pods-and-replicasets/pod-demo.yaml)<br>[`replicaset-demo.yaml`](./02-pods-and-replicasets/replicaset-demo.yaml) |
| **03** | [**Deployments & Zero-Downtime Rollouts**](./03-deployments-and-rollouts/) | Declarative Deployments, Rolling Updates, Rollbacks (`kubectl rollout undo`), MaxSurge & MaxUnavailable | [`deployment-v1.yaml`](./03-deployments-and-rollouts/deployment-v1.yaml)<br>[`deployment-v2.yaml`](./03-deployments-and-rollouts/deployment-v2.yaml) |
| **04** | [**Services & Networking**](./04-services-and-networking/) | Why Pod IPs die, Service Discovery, ClusterIP (internal), NodePort (LAN), Ingress (SSL & Routing) | [`service-clusterip.yaml`](./04-services-and-networking/service-clusterip.yaml)<br>[`ingress-routing.yaml`](./04-services-and-networking/ingress-routing.yaml) |
| **05** | [**ConfigMaps, Secrets & Storage**](./05-configmaps-secrets-storage/) | Decoupling configs from images, Base64 & External Secrets, PersistentVolumes (PV) & PVCs | [`configmap-secrets.yaml`](./05-configmaps-secrets-storage/configmap-secrets.yaml)<br>[`postgres-pvc.yaml`](./05-configmaps-secrets-storage/postgres-pvc.yaml) |
| **06** | [**Health Probes & Auto-Scaling (HPA)**](./06-probes-and-autoscaling/) | Liveness Probes, Readiness Probes, Resource limits, Horizontal Pod Autoscaler (HPA) | [`probes-and-limits.yaml`](./06-probes-and-autoscaling/probes-and-limits.yaml)<br>[`hpa.yaml`](./06-probes-and-autoscaling/hpa.yaml) |
| **07** | [**Disaster Playbook & Senior Interview Prep**](./07-troubleshooting-playbook/) | The 5 Disaster States (`CrashLoopBackOff`, `ImagePullBackOff`, `OOMKilled`, `Pending`), Top 25 Interview Q&As | [`troubleshooting-matrix.md`](./07-troubleshooting-playbook/troubleshooting-matrix.md)<br>[`senior-interview-prep.md`](./07-troubleshooting-playbook/senior-interview-prep.md) |

---

## 💡 The Core Mental Model of Kubernetes

### 1. The Declarative Philosophy (Desired State vs Current State)
- In traditional sysadmin work, you do **imperative** actions: *"Start server A, copy file B, restart process C."* If process C crashes 10 minutes later, you get a 3 AM page.
- In Kubernetes, you declare your **Desired State** in YAML:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  spec:
    replicas: 3
  ```
- Kubernetes runs an infinite **Control Loop**:
  $$\text{Reconciliation Loop} = (\text{Current State} \neq \text{Desired State}) \implies \text{Take Action!}$$
- If a server catches fire and 1 pod dies, Current State becomes `2`. Desired State is `3`. Kubernetes automatically schedules a new pod onto a healthy server within milliseconds. **You sleep through the night.**

---

## ⚡ Essential Kubectl Command Matrix

```bash
# ==========================================
# 🔍 Inspecting Cluster & Resources
# ==========================================
kubectl get nodes                                      # List worker nodes & status
kubectl get pods -A                                    # List all pods across all namespaces
kubectl get pods -o wide                               # Show pod IPs and assigned worker nodes
kubectl describe pod <pod-name>                        # Forensics: inspect events, crashes, error reasons

# ==========================================
# 🛠️ Managing Workloads
# ==========================================
kubectl apply -f deployment.yaml                       # Declaratively create or update resources
kubectl logs -f <pod-name>                             # Stream pod standard output
kubectl exec -it <pod-name> -- sh                      # Interactive shell inside container
kubectl scale deployment my-app --replicas=10          # Instant manual scaling

# ==========================================
# 🌐 Traffic & Port Forwarding
# ==========================================
kubectl port-forward pod/<pod-name> 8080:80            # Tunnel container port directly to your browser
kubectl get services                                   # List active network service endpoints
kubectl get ingress                                    # Inspect HTTP routing rules

# ==========================================
# 🔄 Rolling Update & Rescue
# ==========================================
kubectl rollout status deployment/my-app               # Watch rolling deployment progress
kubectl rollout history deployment/my-app              # View revision history
kubectl rollout undo deployment/my-app                 # Instant 1-command rollback to previous version!
```
