# Lab 01: Tagging & Pushing to Docker Hub

### Objective
Learn how Docker image registries work by publishing your container image to Docker Hub so anyone in the world (or your cloud servers) can download it.

---

### Step 1: Create a Free Docker Hub Account
If you don't already have one, create an account on [hub.docker.com](https://hub.docker.com).
Note your **Docker Hub Username** (e.g., `john_dev`).

---

### Step 2: Log in from your Terminal
Run in PowerShell:
```powershell
docker login
```
Enter your username and Personal Access Token (or password).

---

### Step 3: Tag Your Image with your Namespace
Docker registries identify ownership by the prefix of the image tag:
`[REGISTRY_HOST/][USERNAME]/[IMAGE_NAME]:[TAG]`

Example:
```powershell
# Format: docker tag <local-image> <dockerhub-username>/<repo-name>:<version>
docker tag diagnostic-api:v1 YOUR_USERNAME/diagnostic-api:1.0.0
docker tag diagnostic-api:v1 YOUR_USERNAME/diagnostic-api:latest
```

---

### Step 4: Push to Docker Hub
```powershell
docker push YOUR_USERNAME/diagnostic-api:1.0.0
docker push YOUR_USERNAME/diagnostic-api:latest
```
Now, any server anywhere in the world can run:
```powershell
docker run -d -p 3000:3000 YOUR_USERNAME/diagnostic-api:latest
```
No source code or repository needed on the destination server!
