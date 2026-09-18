# 🚨 Lab 01: Log Rotation & Disk Bomb Defense

> **The Story:**  
> It was Christmas Eve at 4:00 AM. A payments microservice handling thousands of requests per minute suddenly stopped responding.  
> The on-call engineer tried to SSH into the Linux server:  
> `-bash: cannot create temp file for here-document: No space left on device`  
> The root filesystem `/dev/sda1` was at **100% capacity**.  
> Why? The payment service container had been running for 9 months with default Docker settings. Docker's default `json-file` log file had grown to **78 Gigabytes**, silently eating every spare byte on the hard drive until the operating system choked.

---

## 🎯 Learning Objectives
1. Understand where Docker stores container logs on the host disk.
2. Experience how fast unbounded logs accumulate.
3. Learn the container-level fix (`--log-opt max-size` & `--log-opt max-file`).
4. Implement the **Global Host-Level Daemon Configuration** (`daemon.json`) so no container can ever crash your server again.

---

## 🔬 Core Concept: The Silent Disk Killer

By default, Docker captures everything written to `stdout` and `stderr` by container processes and writes them to:
```text
/var/lib/docker/containers/<container-id>/<container-id>-json.log
```
Without configuration, Docker has **zero rotation limit**. It will write until disk space hits 0 bytes.

---

## 🧪 Step-by-Step Practical Lab

### Phase 1: Witnessing the Problem (Unbounded Log Generation)

1. Launch a container that generates continuous verbose logs with default settings:
   ```powershell
   docker run -d --name noisy-app alpine sh -c "while true; do echo 'CRITICAL TRANSACTION LOG RECORD TIMESTAMP $(date) DUMPING PAYLOAD DATA FOR AUDIT 1234567890abcdefghijklmnopqrstuvwxyz'; sleep 0.01; done"
   ```

2. Watch the live logs streaming:
   ```powershell
   docker logs -f noisy-app
   ```
   *(Press `Ctrl+C` after 5 seconds)*

3. Inspect the container's log file path and inspect its properties:
   ```powershell
   docker inspect --format='{{.LogPath}}' noisy-app
   ```
   If this container ran in production for weeks, that single file would reach tens of gigabytes!

4. Clean up:
   ```powershell
   docker rm -f noisy-app
   ```

---

### Phase 2: The Container-Level Shield (`--log-opt`)

When running individual containers, you can enforce hard caps directly on the CLI or in Docker Compose:

1. Run the noisy container with a **1MB maximum size** and **2 backup rotation files**:
   ```powershell
   docker run -d `
     --name capped-app `
     --log-driver json-file `
     --log-opt max-size=1m `
     --log-opt max-file=2 `
     alpine sh -c "while true; do echo 'ROTATING LOG DATA STREAM $(date)'; sleep 0.01; done"
   ```

2. Inspect the configured logging options:
   ```powershell
   docker inspect --format='{{json .HostConfig.LogConfig}}' capped-app
   ```
   *Output:*
   ```json
   {"Type":"json-file","Config":{"max-file":"2","max-size":"1m"}}
   ```
   Now, even if this container runs for 10 years, it can **never consume more than 3MB of total disk space** (1m current + 2m rotated files)!

3. Clean up:
   ```powershell
   docker rm -f capped-app
   ```

---

### Phase 3: The Docker Compose Production Standard

In `docker-compose.yml`, define logging limits for every service:

```yaml
version: '3.8'
services:
  api:
    image: my-production-api
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "5"
```
*Total disk footprint guaranteed:* Maximum 100MB per service.

---

### Phase 4: The Enterprise SRE Standard (Global Daemon Config)

Instead of relying on developers to remember `--log-opt` on every container, configure the **Docker Daemon globally**:

#### On Linux / Production VM (`/etc/docker/daemon.json`):
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```
Reload docker daemon:
```bash
sudo systemctl restart docker
```

#### On Windows / Docker Desktop:
1. Open Docker Desktop.
2. Click the ⚙️ (Settings) icon ➔ **Docker Engine**.
3. Add the `"log-driver"` and `"log-opts"` keys into the JSON editor.
4. Click **Apply & Restart**.

From this moment forward, **every single container** created on your machine automatically inherits log rotation! 🛡️
