# Module 06: Advanced DevOps, Security & Kubernetes Transition

## 🎯 What You Will Master
1. **Resource Limits**: Preventing "Noisy Neighbor" problems by capping CPU and RAM (`--memory`, `--cpus`).
2. **Container Security & CVE Scanning**: Scanning images for vulnerabilities with `docker scout` and Trivy.
3. **Read-Only Root Filesystems**: Making containers tamper-proof in production.
4. **Bridging Docker to Kubernetes (K8s)**:
   - Understanding how the Docker ecosystem translates directly into Kubernetes architecture.
   - Transforming Docker Compose services into Kubernetes **Pods**, **Deployments**, and **Services**.

---

## 🗺️ The Docker-to-Kubernetes Rosetta Stone

| Docker / Compose Concept | Kubernetes (K8s) Equivalent | What It Does |
|---|---|---|
| **Container** | **Container inside a Pod** | Smallest unit of computing |
| **`docker run`** | **Pod** | A single ephemeral instance of 1+ containers |
| **`docker compose service`** | **Deployment / ReplicaSet** | Manages scaling (e.g. 5 replicas), rollouts, self-healing |
| **`-p 3000:3000` / Compose Port** | **Service (ClusterIP / LoadBalancer)** | Provides stable internal IP and load balancing across pods |
| **`docker-compose.yml` environment** | **ConfigMap & Secret** | Decouples configuration and passwords from container images |
| **Named Volume** | **PersistentVolumeClaim (PVC)** | Attaches cloud disk storage (AWS EBS / Google Persistent Disk) |
| **Nginx Reverse Proxy** | **Ingress Controller** | Routes public domain traffic into services |

---

## 📚 Labs & Materials in this Module
- [Lab 1: Resource Limits & Cgroups](./labs/01-resource-limits.md)
- [Lab 2: Container Security & CVE Scanning](./labs/02-security-and-cve-scanning.md)
- [Project 5: Production LMS Infrastructure & Kubernetes Transition](./project-05-production-lms-infra/)
