# Lab 01: Resource Limits & Preventing OOM (Out Of Memory) Crashes

### Objective
Learn how to use Linux Cgroups via Docker to constrain container memory and CPU, preventing a memory leak in one container from crashing your entire host server!

---

### Step 1: Run a Container with Strict Memory Limits
In PowerShell:
```powershell
# Limit container to 64MB of RAM
docker run -d --name memory-limited-app --memory="64m" --memory-swap="64m" nginx:alpine
```

---

### Step 2: Inspect Live Stats
Run Docker's live resource monitoring terminal:
```powershell
docker stats memory-limited-app
```
Look at the output columns:
- `MEM USAGE / LIMIT`: `~3.2MiB / 64MiB`
- `MEM %`: `~5%`
- `CPU %`

*(Press `Ctrl + C` to exit stats)*.

---

### Step 3: What Happens if a Container Exceeds Memory?
If a container exceeds its memory limit, the Linux Kernel triggers **OOM Killer** (Out-of-Memory Killer) and terminates the container immediately with exit code **137**!

Inspect the container exit state:
```powershell
docker inspect memory-limited-app --format='{{.State.OOMKilled}}'
```
Output:
`false` (because Nginx is well within 64MB).

---

### Step 4: Cleanup
```powershell
docker stop memory-limited-app
docker rm memory-limited-app
```
