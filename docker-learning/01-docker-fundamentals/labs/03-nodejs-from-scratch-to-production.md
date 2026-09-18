# 🟢 Exercise 02: Running Node.js from Absolute Zero to Production

> **The Story:**  
> A senior developer joined a company with an existing Express API. On their MacBook with Node v22 and macOS, the app worked flawlessly.  
> They pushed to production (Ubuntu 20.04 running Node v16), and the server immediately threw:  
> `SyntaxError: Unexpected token '?'` (due to nullish coalescing `??` unsupported in old Node versions).  
> The team scrambled for 4 hours fixing version mismatches.  
> **The Docker Promise:** Package the exact Node.js runtime, exact NPM dependencies, and exact OS configuration into an immutable container image. If it runs on your laptop, it runs identically on AWS, Azure, or Kubernetes.

---

## 🎯 Learning Objectives
1. Build a real Node.js REST API with zero local Node installation required.
2. Understand Docker layer caching (`COPY package*.json` before `COPY . .`).
3. Master Port Mapping (`-p HostPort:ContainerPort`) and why container ports are invisible without it.
4. Pass dynamic runtime environment variables (`-e`).
5. **The Pro Developer Hack: Live Hot-Reloading** using Bind Mounts without rebuilding images on every code edit!
6. Harden the container with a non-root user (`USER node`).

---

## 🔬 Core Concept: The Docker Build Cache & Layer Invalidation

```
BAD DOCKERFILE (Builds slow every time):
COPY . .                  ➔ ANY code change invalidates THIS layer!
RUN npm install           ➔ FORCED TO RE-DOWNLOAD 800MB OF PACKAGES EVERY CODE CHANGE! 🐌

PRODUCTION OPTIMIZED DOCKERFILE:
COPY package*.json ./     ➔ Only changes when you install new npm packages!
RUN npm install           ➔ CACHE HIT! Takes 0.05 seconds! ⚡
COPY . .                  ➔ Code changes only re-copy lightweight source files!
```

---

## 🧪 Step-by-Step Practical Lab

### Phase 1: Set Up Project Directory & Code

1. Create a dedicated practice folder:
   ```powershell
   mkdir C:\Users\chyuv\Desktop\Practice\docker-learning\01-docker-fundamentals\labs\sample-node-app -Force
   Set-Location C:\Users\chyuv\Desktop\Practice\docker-learning\01-docker-fundamentals\labs\sample-node-app
   ```

2. Create `package.json`:
   ```json
   {
     "name": "docker-mastery-node-api",
     "version": "1.0.0",
     "description": "Zero to Hero Node.js Docker API",
     "main": "server.js",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.19.2"
     }
   }
   ```

3. Create `server.js`:
   ```javascript
   const express = require('express');
   const os = require('os');

   const app = express();
   const PORT = process.env.PORT || 3000;
   const APP_ENV = process.env.APP_ENV || 'development';

   app.get('/', (req, res) => {
     res.json({
       status: 'success',
       message: '🚀 Node.js is running inside a Docker container!',
       environment: APP_ENV,
       container_hostname: os.hostname(),
       container_uptime_seconds: Math.floor(process.uptime()),
       timestamp: new Date().toISOString()
     });
   });

   app.get('/health', (req, res) => {
     res.status(200).send('OK');
   });

   app.listen(PORT, '0.0.0.0', () => {
     console.log(`⚡ API listening on http://0.0.0.0:${PORT} in ${APP_ENV} mode`);
   });
   ```
   > [!IMPORTANT]
   > Notice `0.0.0.0` instead of `localhost` or `127.0.0.1`. Inside a container, binding to `127.0.0.1` binds ONLY to the container loopback interface, making it inaccessible from outside the container!

4. Create `.dockerignore` (prevents bloated host files from leaking into image):
   ```text
   node_modules
   npm-debug.log
   .git
   .env
   ```

---

### Phase 2: Writing the Production Dockerfile

Create `Dockerfile`:
```dockerfile
# Step 1: Base image with lightweight Alpine Linux
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm install --only=production

# Step 5: Copy application source code
COPY . .

# Step 6: Security - switch from root to built-in 'node' user
USER node

# Step 7: Document exposed port
EXPOSE 3000

# Step 8: Start the application
CMD ["node", "server.js"]
```

---

### Phase 3: Building and Running the Container

1. Build the Docker image:
   ```powershell
   docker build -t node-mastery-api:v1.0 .
   ```

2. Inspect the image size:
   ```powershell
   docker images node-mastery-api:v1.0
   ```
   *(Notice it is only ~140MB because of `node:20-alpine` instead of a 1.2GB full Ubuntu image!)*

3. Run the container with port binding and environment variable injection:
   ```powershell
   docker run -d `
     --name my-node-api `
     -p 8080:3000 `
     -e PORT=3000 `
     -e APP_ENV=production `
     node-mastery-api:v1.0
   ```

4. Verify it's running:
   ```powershell
   docker ps
   docker logs my-node-api
   ```

5. Test the endpoint in PowerShell:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080"
   ```
   Output:
   ```json
   status                   : success
   message                  : 🚀 Node.js is running inside a Docker container!
   environment              : production
   container_hostname       : a1b2c3d4e5f6
   container_uptime_seconds : 12
   ```

---

### Phase 4: The Pro Developer Workflow — Live Hot Reloading (Bind Mounts)

In everyday development, nobody wants to re-run `docker build` every time they edit a single line of code!  
We use **Bind Mounts** with volume trickery:

```powershell
# Stop and remove the production container
docker rm -f my-node-api

# Run container mounting local host directory into /app inside container:
# Note the empty volume mount for /app/node_modules to prevent overwriting Linux modules with Windows modules!
docker run -d `
  --name node-dev `
  -p 8080:3000 `
  -v ${PWD}:/app `
  -v /app/node_modules `
  -e APP_ENV=development `
  node-mastery-api:v1.0
```

Now, if you edit `server.js` on your Windows editor, the changes are **instantly visible** inside the container!

---

### 🧹 Clean Up
```powershell
docker rm -f node-dev
docker rmi node-mastery-api:v1.0
Set-Location C:\Users\chyuv\Desktop\Practice\docker-learning
```
