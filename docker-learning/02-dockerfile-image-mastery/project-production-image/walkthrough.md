# 🧪 Module 02 Walkthrough: Building & Inspecting Production Images

### Step 1: Build the Production Multi-Stage Image
Run in PowerShell:
```powershell
cd c:\Users\chyuv\Desktop\Practice\docker-learning\02-dockerfile-image-mastery\project-production-image
docker build -f Dockerfile.prod -t my-app:prod .
```

Notice the `-f Dockerfile.prod` flag, which specifies which Dockerfile to use when you have multiple configurations!

---

### Step 2: Verify Security (Non-Root User)
Run the production container:
```powershell
docker run -d -p 3000:3000 --name prod-test my-app:prod
```

Now execute `whoami` inside the container:
```powershell
docker exec prod-test whoami
```
Output:
`node`  <-- NOT `root`!

This means even if a remote code execution vulnerability is discovered in an npm library, the attacker is jailed under an unprivileged user.

---

### Step 3: Test Graceful Termination
Test how cleanly the container responds to `docker stop`:
```powershell
docker stop prod-test
docker rm prod-test
```
Notice it stops almost immediately without hanging for 10 seconds (thanks to `dumb-init` properly forwarding `SIGTERM`).
