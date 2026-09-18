# 🏛️ Module 01: Kubernetes Architecture & The Borg Origin Story

> *"Resistance is futile. Your containers will be assimilated into the cluster."*  
> — Google Engineers, naming Kubernetes after Star Trek's Borg 🖖

---

## 📖 The Story: How 2 Billion Containers a Week Created Kubernetes

### The Google Secret (2003 - 2014)
In the early 2000s, Google was growing at a speed no human system administrator could manage.
Gmail, Google Search, Google Maps, and YouTube were receiving billions of requests per second across hundreds of thousands of bare-metal servers.
- When a server burned a hard drive, no one drove to the datacenter at 2 AM to fix it.
- Google wrote an internal, secret orchestration system called **Borg**.
- Borg treated 10,000 servers like a single giant supercomputer. Developers didn't ask: *"Which server will run my app?"* They just said: *"Borg, run 5,000 copies of Search. You figure out where."*
- Every week, Borg launched over **2,000,000,000 (2 Billion) containers**!

### The 2014 Open-Source Gift
In 2014, Google decided to rewrite Borg from scratch in Go (Golang) and donate it to the open-source community under the **Cloud Native Computing Foundation (CNCF)**.
They named it **Kubernetes** (Greek for *"Helmsman"* or *"Captain of the Ship"*, hence the ship steering wheel logo ☸️).
Today, Kubernetes is the undisputed operating system of the global cloud.

---

## 🧠 The Anatomy of a Kubernetes Cluster

A Kubernetes cluster is divided strictly into two roles:
1. **The Control Plane (The Brain 🧠)**: Makes global decisions, schedules pods, detects failures, and manages state.
2. **Worker Nodes (The Muscle 💪)**: The actual virtual or physical machines that run your container workloads.

```
+-------------------------------------------------------------------------------+
|                            KUBERNETES CONTROL PLANE (BRAIN)                   |
|                                                                               |
|   ┌──────────────┐         ┌──────────────┐         ┌───────────────────────┐ |
|   │  API Server  │◀───────▶│     etcd     │         │    kube-scheduler     │ |
|   │ (Front Door) │         │ (Cluster DB) │         │ (Assigns Pod to Node) │ |
|   └──────┬───────┘         └──────────────┘         └──────────┬────────────┘ |
|          │                                                     │              |
|          │                 ┌───────────────────────┐           │              |
|          └────────────────▶│kube-controller-manager│◀──────────┘              |
|                            │(Reconciles State Loop)│                          |
|                            └───────────────────────┘                          |
+-----------------------------------┬───────────────────────────────────────────+
                                    │
                                    ▼
       ┌────────────────────────────┴─────────────────────────────┐
       │                                                          │
       ▼                                                          ▼
+--------------------------------------+   +--------------------------------------+
|            WORKER NODE 1             |   |            WORKER NODE 2             |
|                                      |   |                                      |
|  ┌────────────────────────────────┐  |   |  ┌────────────────────────────────┐  |
|  │ Kubelet (Node Agent / Captain) │  |   |  │ Kubelet (Node Agent / Captain) │  |
|  └────────────────┬───────────────┘  |   |  └────────────────┬───────────────┘  |
|                   │                  |   |                   │                  |
|  ┌────────────────▼───────────────┐  |   |  ┌────────────────▼───────────────┐  |
|  │ Container Runtime (containerd) │  |   |  │ Container Runtime (containerd) │  |
|  └────────────────┬───────────────┘  |   |  └────────────────┬───────────────┘  |
|                   │                  |   |                   │                  |
|  ┌────────────────▼───────────────┐  |   |  ┌────────────────▼───────────────┐  |
|  │  Pod A (App)    Pod B (Cache)  │  |   |  │  Pod C (App)    Pod D (DB)     │  |
|  └────────────────────────────────┘  |   |  └────────────────────────────────┘  |
|  ┌────────────────────────────────┐  |   |  ┌────────────────────────────────┐  |
|  │ Kube-Proxy (Networking/IP routing)│   |  │ Kube-Proxy (Networking/IP routing)│   |
|  └────────────────────────────────┘  |   |  └────────────────────────────────┘  |
+--------------------------------------+   +--------------------------------------+
```

---

## 🔍 Deep-Dive: Control Plane Components

### 1. `kube-apiserver` (The Only Front Door)
- The gatekeeper of the cluster.
- Every `kubectl` command, every internal node update, and every dashboard talks **strictly** to the API Server via HTTPS REST.
- Handles authentication, authorization (RBAC), and validation.

### 2. `etcd` (The Brain's Permanent Memory)
- A distributed, high-availability key-value database (developed by CoreOS).
- Holds the **single source of truth** for the entire cluster.
- Every pod IP, secret, deployment, and node status is recorded in etcd.
- *Rule of Thumb*: If you lose etcd without a backup, your cluster has complete amnesia.

### 3. `kube-scheduler` (The Placement Matchmaker)
- Watches for newly created pods with no assigned node.
- Analyzes worker nodes for:
  - Does Node 1 have enough free RAM & CPU?
  - Does the pod request a GPU?
  - Are there anti-affinity rules ("Don't put two payment pods on the same node")?
- Selects the optimal node and binds the pod to it.

### 4. `kube-controller-manager` (The Infinite Watchdog)
- Runs continuous control loops:
  - **Node Controller**: Notices when a worker node stops reporting heartbeat.
  - **Replication Controller**: Ensures desired number of pod replicas are running.
  - **EndpointSlice Controller**: Connects Services to live Pod IPs.

---

## 🏋️ Deep-Dive: Worker Node Components

### 1. `kubelet` (The On-Site Foreman)
- A background agent running on **every single worker node**.
- Receives PodSpecs from the API Server: *"Run this container with 512MB RAM."*
- Tells the container runtime to pull images and start containers.
- Continually monitors container health and reports back to the API Server.

### 2. `kube-proxy` (The Traffic Cop)
- Manages network rules (using Linux `iptables` or `IPVS`) on each node.
- Enables services to load balance traffic across pods transparently.

### 3. Container Runtime (e.g. `containerd`, `CRI-O`)
- The underlying software that actually executes the containers (Docker used to be the default, now lightweight `containerd` is standard OCI).

---

## ⚡ How to Spin Up Your Local Cluster on Windows

You have two ultra-easy options right now:

### Option A: Docker Desktop 1-Click Kubernetes (Easiest)
1. Open Docker Desktop on your Windows machine.
2. Click the ⚙️ **Settings (Gear Icon)** top right.
3. Click **Kubernetes** in the left sidebar.
4. Check **"Enable Kubernetes"** and click **Apply & Restart**.
5. Wait 2 minutes. Once the little wheel turns green at the bottom left, your cluster is live!

### Option B: Test Cluster Connection
Run in PowerShell:
```powershell
kubectl cluster-info
kubectl get nodes
```
You will see:
```text
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   10m   v1.30.x
```
