# 🐳 Module 02: Automated Docker Builds & Buildx

> *"Never deploy `my-app:latest` to production.*  
> *If you deploy `:latest`, you have zero idea which git commit is actually running in the cluster."*

---

## 🏷️ The Immutable Tagging Golden Rule

| Tagging Strategy | Risk Level | Why |
|---|---|---|
| `:latest` | 🔴 **SUICIDAL** | Overwritten on every build. Rollback is impossible because `:latest` points to whatever was pushed last. |
| `:v1.0.0` | 🟡 **ACCEPTABLE** | Good for public releases, but doesn't tell you the exact Git commit SHA. |
| `v1.2.0-sha-7a8b9c` | 🟢 **PRODUCTION GOLD** | **100% Immutable & Traceable.** You can trace the exact commit in GitHub in 1 click! |

---

## ⚡ Docker Buildx & Multi-Arch Acceleration
Modern cloud infrastructure runs on both **Intel/AMD x86_64** (`linux/amd64`) and **ARM64 Graviton/Apple Silicon** (`linux/arm64`).
Using **Docker Buildx**:
- Builds for both architectures simultaneously.
- Caches layers in GitHub Actions cache (`type=gha`), slashing build times from **4 minutes down to 18 seconds**!

---

## 🧪 Real Working Workflow
Open [`build-and-push.yml`](./build-and-push.yml) to inspect multi-platform image building and automated registry pushing!
