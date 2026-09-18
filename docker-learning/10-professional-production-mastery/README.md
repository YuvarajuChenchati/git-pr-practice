# 🎖️ Module 10: Professional & Senior SRE Docker Mastery
### The Missing 5% That Separates Juniors from Staff DevOps Engineers

> **The Reality:**  
> Anyone can write a 5-line Dockerfile and run `docker run -p 80:80 nginx`.  
> But when a company runs 500 containers in production, 95% of catastrophic production outages are caused by **these 5 hidden traps**:
> 1. Log files consuming 100% of host disk space, locking the root filesystem.
> 2. PID 1 zombie process leaks and unhandled `SIGTERM` signals causing database corruption during deployments.
> 3. Private SSH keys and AWS secrets permanently baked into Docker image layer history.
> 4. Containers running as `root` enabling container breakout exploits (CVE-2019-5736, etc.).
> 5. Build cache thrashing slowing down CI/CD pipelines from 30 seconds to 25 minutes.

---

## 🛑 Trap 1: The Infinite Docker Log Disk Bomb & The Production Fix

### The Disaster:
By default, Docker's default logging driver is `json-file`. It stores all container `stdout` and `stderr` indefinitely with **no size limits**.  
A chatty Node.js or Java application in production can produce 5GB of logs a day. After 20 days, the host server disk hits 100% full:
- The Linux kernel enters read-only emergency state.
- Docker daemon stops responding.
- Databases crash due to inability to write write-ahead logs (WAL).

### The SRE Solution: Global Daemon Log Rotation
Configure `/etc/docker/daemon.json` (or Docker Desktop engine settings):

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```
*Effect:* Any single container's logs are capped at 50MB with a maximum of 3 rotating archives (maximum 150MB total disk usage per container, forever!).

---

## 🛑 Trap 2: The PID 1 Zombie Reaping & Graceful Shutdown (`SIGTERM`)

### The Mystery:
When you run `docker stop my-container`, why does it often sit frozen for **exactly 10 seconds** before finally stopping?  
And why do in-flight database transactions get aborted?

### The Linux Kernel Explanation:
- On Linux, the process with **PID 1** has a special role: it does not get default signal handlers.
- When Docker sends `SIGTERM` (graceful stop), a regular process (like Node.js, Python, or a shell script) running as PID 1 **ignores it** unless explicitly programmed to catch it!
- Docker waits 10 seconds (default timeout), gives up, and sends `SIGKILL` (immediate brutal termination).

### The Solution:
1. **Use Docker's built-in init system (`--init` flag):**
   ```powershell
   docker run -d --init --name safe-app my-node-app
   ```
   Docker injects `tini` as PID 1, which properly catches `SIGTERM`, passes it down to Node.js, and reaps child zombie processes!
2. **In Dockerfile:**
   ```dockerfile
   RUN apk add --no-cache tini
   ENTRYPOINT ["/sbin/tini", "--"]
   CMD ["node", "server.js"]
   ```
3. **In Node.js Code:**
   ```javascript
   process.on('SIGTERM', () => {
     console.log('Received SIGTERM, closing HTTP server and database pool gracefully...');
     server.close(() => {
       db.end(() => {
         process.exit(0);
       });
     });
   });
   ```

---

## 🛑 Trap 3: BuildKit Secrets (No More Leaked Credentials in Image Layers)

### The Mistake:
```dockerfile
# 🚨 DANGEROUS! The secret key is baked into the image layer history forever!
ARG GITHUB_TOKEN
RUN git clone https://${GITHUB_TOKEN}@github.com/my-org/private-repo.git
```
Even if you `RUN rm -rf /root/.git`, anyone who runs `docker history my-image` or `docker inspect` can extract the secret!

### The Senior DevOps Solution: BuildKit Secret Mounts
```dockerfile
# syntax=docker/dockerfile:1.4
FROM alpine
# The secret is mounted into memory ONLY during this RUN instruction and is NEVER stored in the image!
RUN --mount=type=secret,id=my_ssh_key \
    cat /run/secrets/my_ssh_key && \
    git clone ...
```
Building securely:
```powershell
docker build --secret id=my_ssh_key,src=$HOME/.ssh/id_rsa -t secure-build .
```

---

## 🛑 Trap 4: CIS Docker Hardening (Zero-Trust Container Security)

Running containers as `root` (the default) is a massive security hazard. If an attacker exploits a remote code execution (RCE) vulnerability in your web framework, they are root inside the container and can potentially exploit kernel flaws to take over the host.

### The 4 Pillars of Container Hardening:

1. **Enforce Non-Root Execution:**
   ```dockerfile
   RUN addgroup -g 10001 appgroup && adduser -u 10001 -G appgroup -D appuser
   USER 10001
   ```
2. **Drop All Linux Capabilities:**
   By default, Docker grants containers around 14 Linux capabilities (like `CHOWN`, `KILL`, `NET_BIND_SERVICE`). Drop them all and add back only what you strictly need:
   ```yaml
   services:
     api:
       image: my-hardened-api
       cap_drop:
         - ALL
       cap_add:
         - NET_BIND_SERVICE
   ```
3. **Read-Only Root Filesystem:**
   Prevent attackers from downloading cryptominers or rootkits to `/tmp` or `/usr`:
   ```yaml
   services:
     api:
       read_only: true
       tmpfs:
         - /tmp:rw,noexec,nosuid
   ```
4. **Prevent Privilege Escalation:**
   ```yaml
   security_opt:
     - no-new-privileges:true
   ```

---

## 🛑 Trap 5: Docker Compose Profiles & Multi-Environment Overrides

In professional teams, you do not maintain 4 different `docker-compose.yml` files (`docker-compose-dev.yml`, `docker-compose-stage.yml`, `docker-compose-prod.yml`).  
Instead, you use **Composition Inheritance & Profiles**:

### 1. Using Compose Profiles for On-Demand Services
```yaml
services:
  app:
    image: node-app
    ports: ["3000:3000"]

  # Only runs when explicitly requested: docker compose --profile tools up db-migrator
  db-migrator:
    image: flyway/flyway
    profiles: ["tools"]
    command: ["migrate"]

  # Only runs for debugging: docker compose --profile debug up adminer
  adminer:
    image: adminer
    profiles: ["debug"]
    ports: ["8081:8080"]
```

### 2. Base + Override Pattern
- `docker-compose.yml` (Base configuration: service names, networks, volumes)
- `docker-compose.override.yml` (Automatically merged for local dev: bind mounts, host port mappings)
- `docker-compose.prod.yml` (Production: resource limits, replicas, logging drivers)

Command for production deployment:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🧪 Hands-On Labs in this Module

1. **[Lab 1: Log Rotation & Disk Bomb Defense](./labs/01-log-rotation-and-disk-defense.md)**
   - Unbounded log disaster, container-level capping with `--log-opt`, and global `/etc/docker/daemon.json` setup.
2. **[Lab 2: PID 1, Zombie Reaping & Graceful Shutdowns](./labs/02-pid1-zombie-and-sigterm-lab.md)**
   - Experience the 10-second `docker stop` hang, fix it with `--init` (Tini), and write programmatic `SIGTERM` cleanup handlers.
3. **[Lab 3: CIS Benchmark Security Hardening & Read-Only Containers](./labs/03-cis-security-hardening-lab.md)**
   - Enforce unprivileged users (`USER 10001`), lock root filesystems with `--read-only`, and revoke Linux kernel privileges with `--cap-drop=ALL`.
