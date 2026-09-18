# 🚀 Docker from Zero to Production: Interactive Mastery Hub

> *"It works on my machine!"*  
> — Every developer right before production explodes.  
> *"Then pack your machine into a shipping container and ship it!"*  
> — Solomon Hykes, Founder of Docker.

---

## 🌟 Quick Start: Launch the Interactive Learning & Simulator Hub!
We have created a **visual, interactive Docker laboratory** equipped with storytelling episodes, live Dockerfile layer cache simulators, container networking sandboxes, meme quizzes, and a visual command generator!

👉 **Open in your browser**:
```text
file:///c:/Users/chyuv/Desktop/Practice/docker-learning/interactive-hub/index.html
```
Or open [`interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/interactive-hub/index.html) directly in Chrome / Edge.

### 🧪 What's inside the Interactive Hub:
1. 📖 **Story Mode**: The 1956 shipping container revolution, Linux kernel magic (Namespaces & Cgroups), the $340k Black Friday unoptimized Dockerfile disaster, and the amnesiac database mystery.
2. ⚡ **Live Layer & Cache Simulator**: Reorder lines, edit code, and watch cache hits vs cache busts live. Watch image sizes collapse from **1.8GB down to 54MB**!
3. 🌐 **Container Network & Volume Sandbox**: Test Docker's internal DNS server (`127.0.0.11`), toggle port forwarding, and test database volume persistence.
4. 🎮 **Disaster Recovery Quiz Arena**: Scenario challenges with meme feedback (Gigachad DevOps vs Dog in fire "This is fine").
5. 💻 **Visual Command Builder**: Interactive flag toggle for `docker run` with plain-English breakdowns.

---

## 🗺️ Complete Learning Roadmap & Curriculum

| Phase | Module | Concepts Mastered | Hands-On Project / Lab |
|---|---|---|---|
| **01** | [**Docker Fundamentals**](./01-docker-fundamentals/) | Images vs Containers, Daemon, Namespaces, Cgroups, CLI, Port Mapping | **Lab 03: Node.js from Scratch to Production** & Project 1: Diagnostic API |
| **02** | [**Dockerfile & Image Mastery**](./02-dockerfile-image-mastery/) | Layers, Caching, `.dockerignore`, Multi-Stage, Alpine vs Debian | **Production-Grade Node.js Image** (1.8GB ➔ 54MB) |
| **03** | [**Networking & Storage**](./03-networking-and-storage/) | Bridge Networks, Automatic DNS (`127.0.0.11`), Bind Mounts, Named Volumes | **Lab 03: MySQL Queries & Volume Durability** & Project 2: Stack Linking |
| **04** | [**Docker Compose**](./04-docker-compose/) | Declarative Stacks, Dependencies, Healthchecks, Dev Overrides | **Lab 02: 3-Tier Enterprise Deep Dive (Nginx/Redis/MySQL)** & Project 3: E-Commerce |
| **05** | [**Docker in Production & AWS**](./05-docker-in-production-aws/) | Docker Hub, AWS ECR, EC2 Deployment, Nginx Reverse Proxy, HTTPS | **Project 4: Deploy Dockerized API to AWS EC2** |
| **06** | [**Advanced DevOps & Kubernetes**](./06-advanced-devops-and-k8s/) | Security hardening, Resource Limits, BuildKit, K8s Pods/Services | **Project 5: Production LMS Infrastructure & K8s Transition** |
| **07** | [**Interview & Practical Challenges**](./07-interview-and-practical-challenges/) | Broken Dockerfile puzzles, Senior/DevOps Interview Q&A | **3 Real Broken Dockerfile Challenges** |
| **08** | [**Disaster & Troubleshooting Playbook**](./08-troubleshooting-and-disaster-playbook/) | Exit codes (0, 1, 137 OOM), Disk recovery, `docker cp`, `diff` | **Emergency Crash Diagnostics & Forensic Tools** |
| **09** | [**Secrets & Configuration Management**](./09-docker-secrets-and-config/) | Image history leaks, Compose secrets, Runtime injections | **Production-Safe Secret Management** |
| **10** | [**Professional & Senior SRE Mastery**](./10-professional-production-mastery/) | Log rotation (Disk fill bomb), PID 1 zombie reaping, BuildKit secrets, CIS hardening | **5 Critical Senior DevOps Production Traps & Fixes** |

---

## 💡 The Core Mental Model (Remember This Forever)

### 1. IMAGE = CLASS / RECIPE / BLUEPRINT
- Read-only, frozen snapshot containing your code, runtime, system libraries, and dependencies.
- Example: `node:22-alpine` or `my-ecommerce-api:v1.0`.
- Built once, pushed to a registry (Docker Hub / AWS ECR), never altered.

### 2. CONTAINER = OBJECT / INSTANCE / RUNNING PROCESS
- A live, running process isolated by Linux namespaces and restricted by cgroups.
- Has a razor-thin **Read-Write Layer** on top of the read-only image layers.
- You can spin up 50 containers from a single image in 2 seconds.

### 3. THE #1 BEGINNER PITFALL EXPLAINED:
```
Your Windows Laptop (Host)               Docker Virtual Bridge                Container
[ Chrome: localhost:8080 ] ========> [ iptables NAT Rule ] ========> [ Express API: 3000 ]
```
- When your app listens on port `3000` inside a container, it is completely trapped in its private network namespace!
- Running `docker run my-image` **DOES NOT** expose port 3000 to Windows!
- You **MUST** map ports with `-p <HostPort>:<ContainerPort>`:
  ```bash
  docker run -d -p 8080:3000 --name my-app my-image
  ```

---

## ⚡ Essential Quick Command Matrix

```bash
# ==========================================
# 🚢 Container Lifecycle
# ==========================================
docker run -d -p 8080:80 --name web nginx:alpine      # Run in background with port mapping
docker ps                                             # List active running containers
docker ps -a                                          # List all containers (including dead/exited)
docker logs -f web                                    # Follow live container stdout/stderr
docker exec -it web sh                                # Open interactive shell inside running container
docker stop web                                       # Graceful shutdown (SIGTERM -> 10s -> SIGKILL)
docker rm web                                         # Delete stopped container

# ==========================================
# 📦 Image Building & Inspection
# ==========================================
docker build -t my-app:v1 .                           # Build image from local Dockerfile
docker images                                         # List all cached images on your machine
docker history my-app:v1                              # Inspect each layer size and instruction
docker rmi my-app:v1                                  # Delete image from local disk

# ==========================================
# 🌐 Networking & Storage
# ==========================================
docker network create my-mesh                         # Create user-defined bridge network
docker network ls                                     # List existing networks
docker volume create db-data                          # Create persistent named volume
docker volume ls                                      # List persistent volumes

# ==========================================
# 🧹 Disk Cleanup & Rescue
# ==========================================
docker system prune -a --volumes                      # Nuclear cleanup: removes all dead containers,
                                                      # dangling images, and unused networks!
```

---

## 🩺 Docker Doctor Diagnostic Script
Need a 1-click health check on your system, container memory consumption, dangling layers, or disk usage?
Run in PowerShell:
```powershell
.\docker-doctor.ps1
```
