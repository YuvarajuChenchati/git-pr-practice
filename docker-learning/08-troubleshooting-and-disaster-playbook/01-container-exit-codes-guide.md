# 🛠️ Container Exit Codes & Crash Diagnostic Guide

When a Docker container stops unexpectedly, Docker prints an exit status code (e.g. `Exited (137)` or `Exited (1)`).
Here is the definitive guide to diagnose any crash in seconds:

---

## 🚦 Exit Code Quick Matrix

| Exit Code | Name | What Actually Happened | How to Fix It |
|---|---|---|---|
| **0** | Success / Normal Exit | The main process (PID 1) finished its work and exited naturally. | Normal for tasks/scripts. For web servers, your app exited prematurely (e.g., missed an `await` or didn't start an event loop). |
| **1** | Application Error | An uncaught application error / fatal exception in your code (e.g., syntax error, missing module, bad database connection string). | Run `docker logs <container_name>` to read the runtime stack trace! |
| **125** | Docker Run Error | The `docker run` command itself failed (e.g., bad flag or Docker daemon error). | Verify your CLI flags. |
| **126** | Permission Denied | The container entrypoint cannot be executed (e.g., missing execute permissions `chmod +x entrypoint.sh`). | In Dockerfile: `RUN chmod +x /entrypoint.sh` |
| **127** | Command Not Found | The binary or command in `CMD` or `ENTRYPOINT` does not exist in the container image. | If using Alpine, bash might not be installed! Use `sh` or `apk add --no-cache bash`. |
| **137** | SIGKILL / OOM Killed | The container was forcibly killed! **90% of the time, this is OOM (Out Of Memory)!** The Linux kernel ran out of RAM. | 1. Check with `docker inspect <container> --format='{{.State.OOMKilled}}'`. 2. Increase `--memory` limit or optimize app memory leaks. |
| **139** | SIGSEGV | Segmentation fault in compiled code or native C++ modules. | Common when native binaries compiled for glibc are run on Alpine (musl). Use `node:22-bookworm-slim` instead of `alpine`. |
| **143** | SIGTERM | The container received a graceful shutdown signal from Docker (`docker stop`) and cleanly exited. | Normal behavior during stopping/rolling updates. |

---

## 🔍 The 4-Step Forensic Investigation Workflow

Whenever a container fails, execute these 4 commands in order:

### 1. View Exit Status & Details
```powershell
docker ps -a
```

### 2. Inspect Live or Crash Logs
```powershell
docker logs --tail 100 <container_name>
```

### 3. Check if Out-Of-Memory (OOM) Killed it
```powershell
docker inspect <container_name> --format='OOM Killed: {{.State.OOMKilled}}, ExitCode: {{.State.ExitCode}}'
```

### 4. Inspect Environment & Healthcheck Failures
```powershell
docker inspect <container_name> --format='{{json .State.Health}}'
```
