# Lab 02: Port Mapping Demystified (Fixing the #1 Beginner Trap)

### Objective
Learn exactly why running web servers inside Docker often fails for beginners, and how port mapping connects your browser to the container.

---

### The Problem You Experienced

Earlier, you had an Express app listening on port `3000`, and you ran:
```bash
docker run -it <image_id>
```
And you couldn't access `http://localhost:3000` in your browser!

### Why Did That Happen?

A container has its own private virtual network card (`eth0`) with its own private IP address (like `172.17.0.2`).
When your server listens on port `3000`:
- It is listening on port `3000` inside `172.17.0.2`.
- Windows / your host machine has **NO ROUTE** to that internal IP by default.
- Therefore, opening `http://localhost:3000` in Chrome fails because nothing on Windows is listening on port `3000`!

---

### The Solution: The `-p` Flag (Port Forwarding)

Syntax:
```
-p <HOST_PORT>:<CONTAINER_PORT>
```

Example:
```bash
docker run -d -p 8080:80 --name web-server nginx
```

What this tells the Docker Daemon:
> "Whenever traffic arrives on my Windows laptop on port **8080**, forward it directly into the container's port **80**."

---

### Hands-on Exercise: Run Nginx with Port Mapping

Run this command in PowerShell:
```powershell
docker run -d -p 8080:80 --name test-nginx nginx
```

Check running containers:
```powershell
docker ps
```
Look at the `PORTS` column:
`0.0.0.0:8080->80/tcp`

Now open your web browser or run in PowerShell:
```powershell
curl http://localhost:8080
```
You will receive:
`Welcome to nginx!`

Now stop and clean up:
```powershell
docker stop test-nginx
docker rm test-nginx
```

---

### Critical Rule for Node / Python / Go Apps:
When running an HTTP server inside Docker, you must bind to `0.0.0.0` (all interfaces), **NOT** `127.0.0.1` (localhost)!
- `127.0.0.1` inside a container means *"only accept requests originating from inside this container"*.
- `0.0.0.0` means *"accept requests coming from outside via Docker's bridge network"*.

In Node.js:
```javascript
// ✅ CORRECT:
app.listen(3000, "0.0.0.0", () => ...);

// ❌ WRONG (Cannot be reached from outside):
app.listen(3000, "127.0.0.1", () => ...);
```
