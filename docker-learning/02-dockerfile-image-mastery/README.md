# 📦 Module 02: Dockerfile & Image Mastery — From 1.8GB to 54MB

> *"Images are like onions. Onions have layers. Docker images have layers."*  
> — Shrek, Senior Cloud Architect 🧅

---

## 😱 The Real Production Horror Story: The 1.8GB Black Friday Meltdown

It was midnight on Black Friday. Traffic spiked 10x on an e-commerce platform.
The Kubernetes auto-scaler triggered: **"Spin up 50 new replicas immediately!"**

Then disaster struck:
- The Dockerfile was written by someone who didn't understand layer caching or base images:
  ```dockerfile
  FROM node:22
  WORKDIR /app
  COPY . .
  RUN npm install
  RUN npm run build
  CMD ["node", "dist/server.js"]
  ```
- **The Catastrophe**:
  1. `FROM node:22` downloaded full Debian with compilers, Python, and C++ headers: **1.1 GB**.
  2. `COPY . .` copied local `node_modules`, `.git` repository history, test mocks, and design assets!
  3. `RUN npm install` installed 600MB of devDependencies (`tsc`, `eslint`, `jest`, `webpack`).
  4. The final image size was **1.85 Gigabytes**!
  5. 50 pods tried downloading 1.85 GB each = **92.5 Gigabytes of network transfer**.
  6. AWS registry throttled the requests, worker nodes ran out of disk space (`ImagePullBackOff`), and the checkout service crashed for 38 minutes.
  7. **Loss: $340,000 in lost transactions.**

---

## ⚡ How Docker Layer Caching Actually Works

Each instruction in your `Dockerfile` creates an **immutable, read-only filesystem layer**:

```
Dockerfile Line                             Layer Generated                      Cache Status
--------------------------------------------------------------------------------------------------
FROM node:22-alpine                         OS Binaries + Node runtime           [CACHED]
WORKDIR /app                                Directory pointer / metadata         [CACHED]
COPY package*.json ./                       Checksum of package manifests        [CACHED] (Unless deps change)
RUN npm ci --only=production                Installed npm production packages    [CACHED] (0.0s rebuild!)
COPY . .                                    Source code files                    [BUSTS CACHE when code edits]
USER node                                   Non-root user metadata               [Re-evaluated]
CMD ["node", "server.js"]                   Container launch command             [Metadata]
```

### 🚨 The Golden Rule of Layer Caching:
> Docker executes top to bottom. If any instruction's checksum changes (e.g. `COPY . .` when you change a CSS file or JS line), **THAT LAYER AND EVERY SINGLE LAYER BELOW IT LOSES ITS CACHE!**

**The Rookie Mistake**:
```dockerfile
# ❌ BAD: COPYING CODE BEFORE INSTALLING DEPENDENCIES!
COPY . .
RUN npm install
```
*Why this is terrible*: Every time you edit one line of code, Docker assumes everything changed and re-downloads all 1,000 npm packages from the internet (taking 2 minutes every build).

**The Senior Pattern**:
```dockerfile
# ✅ GOOD: CACHE DEPENDENCIES SEPARATELY!
COPY package*.json ./
RUN npm ci --only=production
COPY . .
```
*Why this is brilliant*: When you edit your application code, Docker realizes `package.json` didn't change, reuses the cached `node_modules` layer instantly, and finishes the build in **0.4 seconds**!

---

## 🛡️ Multi-Stage Builds: The Ultimate Weapon

Why should your production container carry TypeScript compilers, Webpack bundlers, test frameworks, and linters? **It shouldn't!**

With **Multi-Stage Builds**, you use two separate environments in the same Dockerfile:
1. **Stage 1 (Builder)**: A temporary workshop where you compile code and bundle assets.
2. **Stage 2 (Runner)**: A brand new, pristine base image that copies **ONLY** the production artifacts from Stage 1. Everything else is thrown into the trash!

```dockerfile
# ==========================================
# STAGE 1: The Builder (Throwaway Workshop)
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies including TypeScript compiler
COPY package*.json ./
RUN npm ci

# Copy source code & compile
COPY . .
RUN npm run build
# Prune out devDependencies so only runtime dependencies remain
RUN npm prune --production

# ==========================================
# STAGE 2: The Production Runner (Tiny & Secure)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Run as unprivileged node user (UID 1000)
USER node

# Copy ONLY compiled dist and clean production node_modules from Stage 1
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 📊 The Shocking Result:
- Image Size: **1,850 MB ➔ 54 MB** (97% reduction!).
- Security Vulnerabilities (CVEs): **148 ➔ 0**.
- Build Re-run Time: **4 minutes ➔ 1.2 seconds**.

---

## 🧟 The Zombie Process & PID 1 Problem

When you run an app in Docker:
```bash
docker stop my-container
```
Ever noticed Docker freezing for **10 full seconds** before killing the container?
Here is why:
1. In Linux, **PID 1** has special operating system responsibilities:
   - It must forward signals (`SIGTERM`, `SIGINT`) to child processes.
   - It must reap "zombie processes" (defunct dead processes).
2. By default, **Node.js and Python DO NOT forward signals when running as PID 1**.
3. When Docker sends `SIGTERM` ("Please shut down gracefully"), Node.js ignores it.
4. Docker waits 10 seconds, gives up, and violently kills it with `SIGKILL` (Exit Code 137), corrupting in-flight database transactions!

### The Solution:
Use an init process like **`tini`** or **`dumb-init`**:
```dockerfile
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
```
Now `tini` runs as PID 1, handles signals cleanly, and forwards `SIGTERM` instantly to your Node app!

---

## 🧪 Hands-On Labs in this Module

1. **[Lab 1: Layer Caching Experiment](./labs/01-layer-caching-experiment.md)**
   - Prove the cache bust theory with stopwatches and `docker history`.
2. **[Lab 2: Multi-Stage Comparison](./labs/02-multistage-comparison.md)**
   - Compare single-stage vs multi-stage image sizes side by side.
3. **[Project: Production-Grade Node.js Image](./project-production-image/)**
   - Build a production-ready TypeScript microservice image with `.dockerignore`, non-root user, and multi-stage optimization.
