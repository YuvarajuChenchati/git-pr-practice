# 🧟 Lab 02: PID 1, Zombie Reaping & The 10-Second Shutdown Trap

> **The Story:**  
> During a zero-downtime rolling deployment on a production cluster, rolling out version 2.0 took **25 minutes** instead of 30 seconds.  
> Every time the orchestrator tried to shut down an old container, the command froze for **exactly 10 seconds** before terminating. Worse, when users checked their profiles, half-finished database writes were corrupted!  
> **Why?** The Node.js application was running directly as **PID 1** inside the Linux container. In the Linux kernel, PID 1 does not get default signal handlers. When Docker sent `SIGTERM` ("please wrap up and shut down gracefully"), Node.js ignored it completely!  
> After 10 seconds, Docker gave up and executed `SIGKILL` (brutal termination), dropping all active database connections mid-query.

---

## 🎯 Learning Objectives
1. Experience the painful 10-second `docker stop` delay first-hand.
2. Understand why Linux PID 1 ignores standard signals like `SIGTERM`.
3. Fix the problem using Docker's native `--init` flag (`tini`).
4. Implement programmatic `SIGTERM` listeners in your application code for 100% clean, zero-data-loss graceful shutdowns.

---

## 🔬 The Signal Timeline

```
WITHOUT INIT / SIGNAL HANDLER:
docker stop container
      │
      ▼
Sends SIGTERM (Graceful shutdown) ──> [ PID 1: node server.js ] (IGNORES SIGNAL 🙉)
      │
      ├─ Waiting 1s... 2s... 5s... 9s... 10s... (Frozen timeout!)
      ▼
Docker times out and sends SIGKILL (Brutal murder 💥) ──> In-flight DB writes corrupted!

WITH DOCKER --init (Tini as PID 1):
docker stop container
      │
      ▼
Sends SIGTERM ──> [ PID 1: tini ] ──> Forwards SIGTERM ──> [ node server.js ]
                                                                │
                                              Finishes requests, closes DB pool
                                              Exits cleanly in 0.15s! ⚡
```

---

## 🧪 Step-by-Step Practical Lab

### Phase 1: Reproducing the 10-Second Hang

1. Run a container running a dummy script as PID 1 that does not trap signals:
   ```powershell
   docker run -d --name hanging-container alpine sh -c "trap '' TERM; while true; do sleep 1; done"
   ```

2. Time how long it takes to stop this container using PowerShell's `Measure-Command`:
   ```powershell
   Measure-Command { docker stop hanging-container }
   ```

3. **Look at the stopwatch output:**
   ```text
   TotalSeconds      : 10.231945
   ```
   Notice that? It hung for **over 10 seconds** before Docker sent a ruthless `SIGKILL`!
   Imagine having 50 containers during a deployment—your deployment will stall for 8 minutes!

4. Remove the container:
   ```powershell
   docker rm hanging-container
   ```

---

### Phase 2: The 1-Flag Miracle Fix (`--init`)

Docker comes bundled with a tiny, specialized init binary called **Tini**.  
When you supply the `--init` flag, Docker inserts `tini` as PID 1 inside the container namespace.

1. Launch a container with `--init`:
   ```powershell
   docker run -d --init --name fast-container alpine sh -c "while true; do sleep 1; done"
   ```

2. Inspect the process tree inside the container:
   ```powershell
   docker exec fast-container ps aux
   ```
   *Output:*
   ```text
   PID   USER     TIME  COMMAND
     1   root     0:00  docker-init -- sh -c while true; do sleep 1; done
     7   root     0:00  sh -c while true; do sleep 1; done
     8   root     0:00  sleep 1
   ```
   Notice that `docker-init` is **PID 1**, and your script is a child process!

3. Now time `docker stop`:
   ```powershell
   Measure-Command { docker stop fast-container }
   ```

4. **Look at the result:**
   ```text
   TotalSeconds      : 0.284192
   ```
   ⚡ **From 10.2 seconds down to 0.28 seconds!**  
   Tini caught `SIGTERM`, forwarded it to the process, and cleanly harvested the container immediately.

5. Clean up:
   ```powershell
   docker rm fast-container
   ```

---

### Phase 3: Writing Production Graceful Shutdown Handlers in Code

In your production Node.js apps, catch `SIGTERM` and `SIGINT` to gracefully drain HTTP connections and close database pools:

```javascript
// server.js
const express = require('express');
const app = express();

const server = app.listen(3000, () => {
  console.log('App running on port 3000');
});

// Catch graceful stop signals sent by Docker / Kubernetes
function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new HTTP requests
  server.close(() => {
    console.log('✅ Closed all active HTTP connections.');

    // Close Database pools / Redis connections here:
    // await db.end();
    console.log('✅ Closed database connection pool.');

    process.exit(0); // Exit cleanly with code 0
  });

  // If cleanup takes longer than 5 seconds, force exit
  setTimeout(() => {
    console.error('⚠️ Forcefully terminating after 5s timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### In `docker-compose.yml`:
You can configure `stop_grace_period` and `init: true` declaratively:
```yaml
services:
  api:
    image: my-node-api
    init: true
    stop_grace_period: 15s  # Gives the app 15s to finish active user checkouts before SIGKILL
```
