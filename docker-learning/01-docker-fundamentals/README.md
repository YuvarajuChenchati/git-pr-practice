# 🐳 Module 01: Docker Fundamentals & The Linux Kernel Magic

> *"Docker is just a lightweight VM."*  
> ❌ **WRONG.** If you say this in a DevOps interview, the interviewer's heart breaks.  
> Let's master what Docker *actually* is.

---

## 🎭 The Story: The 1956 Shipping Miracle & The 2013 Software Revolution

### The Pre-1956 World of Chaos
Before 1956, transporting cargo was a disaster. If you wanted to ship apples, pianos, and barrels of rum from New York to London:
- Men manually loaded trucks box by box.
- At the dock, longshoremen spent **a full week** unloading the truck and stuffing the ship's hull like a game of Tetris.
- Barrels cracked, cargo was stolen, and ships spent **more time stuck in harbor than sailing**.
- The cost to transport cargo: **$5.86 per ton**.

In 1956, **Malcolm McLean** invented the **standard steel shipping container**:
- Pack once at the factory. Seal it.
- Hoist the standard box onto a truck, then crane it directly onto a ship, then onto a train.
- The contents were never touched until delivery!
- Transport cost plummeted from **$5.86/ton to $0.16/ton** (97% reduction). World trade exploded.

### Fast-Forward to Software (2013)
Until Docker appeared in 2013, software deployment was the 1950s dockyard:
- Developer had Node 18 + Python 3.8 + OpenSSL 1.1 on Ubuntu.
- QA tested on macOS with Node 20.
- Production ran CentOS with OpenSSL 1.0: **CRASH.**
- The infamous excuse was born: *"Well, it works on my machine!"*

**Solomon Hykes created Docker** to build the shipping container for software:
> Package your application code, system libraries, configuration files, and runtime into one **standard immutable container image**. If it runs on your laptop, it runs on AWS, Azure, Google Cloud, and Kubernetes identically.

---

## 🧠 The Anatomy: Containers vs Virtual Machines

| Feature | Virtual Machine (VM) | Docker Container |
|---|---|---|
| **Architecture** | Emulates hardware via Hypervisor | Runs directly on Host Linux Kernel |
| **Guest OS** | Full OS (Windows/Ubuntu) ~2GB-10GB | None! Shares host kernel |
| **Boot Time** | 30 to 90 seconds | **50 to 200 milliseconds** |
| **RAM Overhead** | High (~1GB per VM idle) | Almost zero (~10MB per container) |
| **Isolation** | Hardware-level hypervisor | Kernel-level (Namespaces & Cgroups) |

```
+-------------------------------------------------------------+
|                     VIRTUAL MACHINE                         |
|  +--------------------+  +--------------------+             |
|  | App A              |  | App B              |             |
|  | Bins/Libs          |  | Bins/Libs          |             |
|  | Full Guest OS (2GB)|  | Full Guest OS (2GB)|             |
|  +--------------------+  +--------------------+             |
|  | Hypervisor (VMware / VirtualBox)           |             |
|  | Host OS (Windows / Linux)                  |             |
|  | Physical Server Hardware                   |             |
+-------------------------------------------------------------+

vs

+-------------------------------------------------------------+
|                     DOCKER CONTAINER                        |
|  +--------------------+  +--------------------+             |
|  | App A              |  | App B              |             |
|  | Bins / Libs        |  | Bins / Libs        |             |
|  | Isolated PID / Net |  | Isolated PID / Net |             |
|  +--------------------+  +--------------------+             |
|  | Docker Engine (Namespaces, Cgroups, OverlayFS)           |
|  | Shared Host Linux Kernel (WSL2 on Windows)               |
|  | Physical Server Hardware                                 |
+-------------------------------------------------------------+
```

---

## 🔮 The Linux Kernel Trinity: How Docker Actually Isolates

Docker is not magic. It relies on 3 core features built into the Linux kernel:

### 1. Namespaces (The Invisibility Cloak 🥷)
Namespaces dictate **what a container can SEE**:
- **PID Namespace**: Isolates Process IDs. Your Node app thinks it is PID 1 (master of the machine), but on your host system it might be PID 34912!
- **NET Namespace**: Gives each container its own private IP address, routing table, and virtual network card (`eth0`).
- **MNT Namespace**: Isolates filesystem mount points. The container cannot see your Windows `C:\` drive or host files unless you explicitly mount them.
- **UTS Namespace**: Gives the container its own hostname.
- **IPC Namespace**: Prevents containers from reading shared memory of other host processes.
- **USER Namespace**: Container thinks it is `root`, but is mapped to a low-privilege user on the host.

### 2. Cgroups / Control Groups (The Bouncers at the Club 🥊)
While namespaces restrict what you can **see**, cgroups restrict what you can **USE**:
- Limit RAM: `docker run -m 512m my-api` (prevents memory leaks from crashing your machine).
- Limit CPU: `docker run --cpus="1.5" my-api`.
- If a container exceeds its memory limit, the Linux kernel **OOM (Out Of Memory) Killer** instantly terminates it with **Exit Code 137**.

### 3. OverlayFS / UnionFS (The Tracing Paper Stack 📄)
Images are built from read-only filesystem layers stacked on top of each other.
When you launch a container, Docker adds a single thin **Read-Write layer** on top:
- Multiple containers share the exact same underlying 500MB image in memory.
- If container A modifies a file, OverlayFS copies that file up into container A's read-write layer (**Copy-On-Write**). Container B remains completely untouched!

---

## 🔄 The Complete Container Lifecycle

```
             [ docker build / pull ]
                        │
                        ▼
                 ┌───────────────┐
                 │  IMAGE (Disk) │
                 └───────────────┘
                        │
                        │ docker create / run
                        ▼
               ┌──────────────────┐
        ┌─────▶│ RUNNING (Active) │◀─────┐
        │      └──────────────────┘      │
        │         │            │         │
docker unpause    │ docker     │ docker  │ docker
        │         │ pause      │ stop    │ start
        │         ▼            ▼         │
        │      ┌────────┐   ┌─────────┐  │
        └──────│ PAUSED │   │ STOPPED │──┘
               └────────┘   └─────────┘
                                 │
                                 │ docker rm
                                 ▼
                              [ VOID ]
```

---

## 🧪 Hands-On Labs in this Module

Work through these interactive labs:
1. **[Lab 1: Your First Containers & CLI Forensics](./labs/01-first-container.md)**
   - Run interactive Alpine containers, explore isolated process trees, inspect filesystems, and test detached vs foreground mode.
2. **[Lab 2: Port Mapping Demystified](./labs/02-port-mapping-demystified.md)**
   - Solve the `#1 beginner issue` ("Why does localhost:3000 say connection refused?"). Understand virtual bridge NAT packet routing.
3. **[Lab 3: Running Node.js from Absolute Zero to Production](./labs/03-nodejs-from-scratch-to-production.md)**
   - From raw `package.json` to multi-layer image caching, non-root security (`USER node`), and live hot-reloading bind mounts without rebuilds!
4. **[Project 1: Containerize Node.js Diagnostic API](./project-01-nodejs-api/)**
   - Build a real Node.js diagnostic service, write its Dockerfile, inspect image layers with `docker history`, map ports, and view the live diagnostic dashboard!
