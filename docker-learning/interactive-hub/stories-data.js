// Interactive Docker Mastery Data: Stories, Memes, Case Studies & Quiz Arena
window.DOCKER_DATA = {
  stories: [
    {
      id: "ch1-shipping-revolution",
      title: "Episode 1: The 'Works on My Machine' Curse & The 1956 Shipping Miracle",
      tagline: "How physical steel boxes saved world trade, and how software containers saved developers from 3 AM calls.",
      memeUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
      memeCaption: "Dev: 'It works on my machine!' DevOps: 'Then pack your machine and ship it!'",
      content: `
### 🚢 The 1956 Shipping Nightmare: Why Everything Used to Break
Imagine it is 1950. You want to ship 200 bags of coffee beans, 50 barrels of rum, 10 crates of whiskey, and a piano from New York to London.
- Men manually loaded each crate onto a truck.
- At the docks, dozens of longshoremen spent **8 days** unpacking the truck and stuffing items into the ship's dark belly.
- Sacks tore, rum barrels smashed, and cargo got stolen. Ships spent **more time parked at docks than sailing**.
- The cost to transport goods was roughly **$5.86 per ton**.

Then in 1956, a truck driver named **Malcolm McLean** said:
> *"Why the hell are we unpacking the truck? Why not just build a standard steel box, pack it once at the warehouse, lock it, and hoist the entire box from truck to ship to train without ever touching the contents?"*

Boom! The **intermodal shipping container** was born. The loading cost plummeted from **$5.86 per ton to 16 cents per ton** (a 97% reduction!). World trade exploded.

---

### 💻 Fast Forward to Software (2013): The Digital Dock Nightmare
Until 2013, software deployment was the 1950s dockyard:
- A developer wrote Python 3.8 on Ubuntu with \`libssl.so.1.1\` installed.
- The QA engineer tried running it on macOS with Python 3.9: **CRASH.**
- The production server was running CentOS 7 with OpenSSL 1.0: **CATASTROPHIC FAILURE.**
- Developer's famous last words: *"Well, it worked on my machine!"*
- DevOps team's angry response: *"Are we shipping your machine to the customer?!"*

Enter **Solomon Hykes and Docker (2013)**.
Docker did for code what Malcolm McLean did for rum barrels:
> Put your application, your runtime (Node, Python, Java), your system libraries, your configs, and your dependencies into one **standardized software container**. 
> If it runs on your MacBook, it runs on Windows WSL2, on Ubuntu Linux, and on an AWS EC2 instance. **Identical byte-for-byte.**

---

### 🧠 The Core Mental Model
| Physical Shipping Container | Docker Software Container |
|---|---|
| **Standard Steel Dimensions (20ft / 40ft)** | Standard OCI Container Format |
| **Gantry Crane & Container Ships** | Docker Engine & Kubernetes |
| **Cargo (Whiskey, Cars, Shoes)** | Application (Node.js, PostgreSQL, Nginx) |
| **Sealed at Factory, Opened at Destination** | Immutable Docker Image built once, run anywhere |
| **Ship doesn't care what's inside** | Cloud/Server doesn't care what language you wrote |
      `,
      takeaways: [
        "Containers solve the matrix of dependencies: App X + Runtime Y + OS Z.",
        "An image is immutable: you build it once, test it once, and ship the exact same artifact.",
        "Never say 'works on my machine' again—if it's containerized, it works everywhere Docker runs."
      ]
    },
    {
      id: "ch2-matrix-namespaces",
      title: "Episode 2: Inside The Matrix — Namespaces, Cgroups & Ghost Processes",
      tagline: "Debunking the biggest myth: Docker is NOT a Virtual Machine. Here is the magic under the hood.",
      memeUrl: "https://media.giphy.com/media/VbE1xtnPHx6sf35mr0/giphy.gif",
      memeCaption: "Containers inside Linux: 'You think that's RAM you're breathing now?'",
      content: `
### 🚫 Myth Buster: "Docker is just a lightweight VM!"
**NO, IT IS NOT.** Repeat this 3 times before any DevOps interview!

Let's look at the anatomical difference:
- **Virtual Machine (VM)**: Hypervisor (VMware/VirtualBox) simulates fake hardware (virtual CPU, virtual BIOS, virtual NIC). You install an entire 4GB Windows or Ubuntu OS, boot up its kernel, and run background daemons you don't even need. Boot time: **30–90 seconds**. Memory overhead: **1GB+ per VM**.
- **Docker Container**: There is **NO virtual hardware**. There is **NO second kernel**. The container is literally just a **regular process running directly on your host Linux kernel**, wearing a blindfold and handcuffs! Boot time: **0.1 seconds**. Memory overhead: **Near zero**.

---

### 🎭 The Trinity of Container Magic in the Linux Kernel

#### 1. Namespaces (The Invisibility Cloak)
Namespaces control **what a container can SEE**.
- **PID Namespace (Process IDs)**: Inside the container, your Node app thinks it is PID 1 (God of the machine). On the host machine, it is actually PID 18492.
- **NET Namespace (Networking)**: Gives the container its own private loopback (\`127.0.0.1\`), virtual Ethernet interface (\`eth0\`), routing table, and private IP (e.g. \`172.17.0.2\`).
- **MNT Namespace (Mount / Filesystem)**: Container only sees its own root filesystem (\`/bin\`, \`/app\`, \`/etc\`). It has no idea \`C:\\Users\\chyuv\` or \`/home\` exists on the host.
- **UTS Namespace**: Container can have its own hostname (e.g., \`web-server-01\`).
- **IPC Namespace**: Isolates shared memory channels.
- **USER Namespace**: Container thinks it is \`root\` (UID 0), but mapped to an unprivileged user on the host.

#### 2. Cgroups / Control Groups (The Bouncers at the Club)
While Namespaces restrict what you can **see**, Cgroups restrict what you can **USE**.
- *Without Cgroups*: One rogue memory-leaking container can eat 100% of your RAM, causing the entire host server to freeze and die.
- *With Cgroups*: You tell Docker: \`docker run -m 512m --cpus=1.5 my-app\`. If the container tries to grab 513MB, Linux's Out-Of-Memory (OOM) killer immediately terminates it before it hurts the host!

#### 3. OverlayFS / UnionFS (The Tracing Paper Stack)
Imagine drawing on clear plastic sheets.
- Sheet 1 (Bottom): Ubuntu base image (read-only).
- Sheet 2: Node.js binary (read-only).
- Sheet 3: Your application code (read-only).
- Sheet 4 (Top): **Container Read-Write Layer (Copy-on-Write)**.
When your app creates a temporary file or writes a log, it only writes to Sheet 4. The underlying 500MB of images are shared across 100 containers simultaneously, consuming **zero extra disk space**!
      `,
      takeaways: [
        "A container is just a normal Linux process wrapped in namespaces and cgroups.",
        "Namespaces isolate visibility (PID, Network, Filesystem).",
        "Cgroups enforce resource limits (Memory, CPU).",
        "OverlayFS stacks read-only image layers with a thin read-write container layer."
      ]
    },
    {
      id: "ch3-black-friday-disaster",
      title: "Episode 3: The 1.8GB Black Friday Meltdown & The Multi-Stage Salvation",
      tagline: "A real production horror story: How one bad Dockerfile crashed an e-commerce checkout at peak midnight traffic.",
      memeUrl: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      memeCaption: "DevOps watching 20 autoscaling nodes pull 1.8GB images over a saturated network.",
      content: `
### 🔥 The True Horror Story: Midnight, November 27
It was Black Friday. Traffic spiked 10x on a booming e-commerce platform.
The Kubernetes auto-scaler triggered: **"Deploy 50 new replica containers immediately to handle checkout queue!"**

Then catastrophe struck:
1. The developer's Dockerfile looked like this:
\`\`\`dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]
\`\`\`
2. **What went wrong?**
   - The base image \`node:22\` is full Debian with Python, gcc, g++, curl, headers: **1.1 GB**.
   - \`COPY . .\` without a \`.dockerignore\` copied \`node_modules\`, \`.git\` history, test suites, and high-res design assets!
   - \`npm install\` installed 800MB of devDependencies (TypeScript, Webpack, Jest, ESLint).
   - The final production image was **1.85 Gigabytes**!
3. **The Domino Effect**:
   - 50 new pods tried pulling 1.85 GB each = **92.5 Gigabytes of network transfer**.
   - AWS ECR registry throttled the requests.
   - Nodes ran out of disk space (\`ImagePullBackOff\` error).
   - Checkout crashed for 38 minutes. Cost: **$340,000 in lost sales**.

---

### 🛡️ The Salvation: Multi-Stage Builds & Alpine
How the senior engineer fixed it in 15 minutes:

\`\`\`dockerfile
# ===============================
# STAGE 1: The Builder (Throwaway Workshop)
# ===============================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Prune out devDependencies so only production libs remain
RUN npm prune --production

# ===============================
# STAGE 2: The Production Runner (Tiny & Secure)
# ===============================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Don't run as root!
USER node

# Copy ONLY what is strictly needed from Stage 1
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 📊 The Shocking Result:
- Image size collapsed from **1,850 MB down to 68 MB** (96% drop!).
- Pull time dropped from **4 minutes to 2.4 seconds**.
- Security vulnerabilities dropped from **148 CVEs down to 0**.
      `,
      takeaways: [
        "Never use full OS base images in production when an alpine or slim variant exists.",
        "Always use multi-stage builds: compile in stage 1, copy only binaries/dist to stage 2.",
        "Always add a .dockerignore file to block .git, local node_modules, and secrets."
      ]
    },
    {
      id: "ch4-amnesiac-database",
      title: "Episode 4: The Mystery of the Amnesiac Database & The Volume Lifeline",
      tagline: "Containers are born to die. If you don't anchor your data to a Volume, it will vanish into the void.",
      memeUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
      memeCaption: "Junior dev restarting MySQL container: 'Where did the 10,000 customer records go?!'",
      content: `
### 🏨 The Hotel Room Analogy
Think of a Docker container like a **hotel room**:
- When you check in (container starts), you get clean sheets, towels, and soap.
- You can leave your dirty socks on the floor, write on a notepad, or turn the TV to channel 5.
- But when you check out and the maid cleans the room (\`docker rm\`), **everything you left behind is permanently incinerated!**
- The next guest gets a brand new, pristine room.

**Containers are Ephemeral.** That is by design! They are meant to be cattle, not pets.
If a container crashes, you should be able to destroy it and recreate it in 1 second.

---

### 💥 The Disaster: The Ephemeral Database Trap
A junior developer ran:
\`\`\`bash
docker run -d --name my-db -e MYSQL_ROOT_PASSWORD=secret mysql:8.0
\`\`\`
For 3 weeks, users signed up, placed orders, and posted comments.
One night, Docker Desktop updated and restarted:
\`\`\`bash
docker rm my-db
docker run -d --name my-db -e MYSQL_ROOT_PASSWORD=secret mysql:8.0
\`\`\`
**Result**: The database was 100% blank. The tables were gone. All customer data vanished!

---

### ⚓ The 3 Storage Solutions
To give containers long-term memory, we punch a hole through the container filesystem:

#### 1. Named Volumes (Production Gold Standard)
Managed by Docker in a safe location on the host (\`/var/lib/docker/volumes/\`).
\`\`\`bash
docker run -d -v mysql_data:/var/lib/mysql mysql:8.0
\`\`\`
- If the container is destroyed, \`mysql_data\` remains intact forever.
- Spin up a new container with the same volume, and all data is instantly restored!

#### 2. Bind Mounts (Local Development Superpower)
Mount a folder directly from your local project into the container.
\`\`\`bash
docker run -d -p 3000:3000 -v \${PWD}/src:/app/src my-dev-app
\`\`\`
- Edit code in VS Code on Windows -> It reflects instantly inside the container! No rebuild needed.

#### 3. tmpfs Mounts (High-Speed In-Memory)
Lives in host RAM only, never written to disk. Perfect for transient tokens or high-security session keys.
      `,
      takeaways: [
        "Container filesystems are temporary. Destroying a container destroys all unmounted data.",
        "Always use Named Volumes for databases (Postgres, MySQL, Mongo, Redis).",
        "Use Bind Mounts for hot-reloading code during local development."
      ]
    },
    {
      id: "ch5-compose-orchestra",
      title: "Episode 5: The Microservice Symphony — Compose & Internal DNS",
      tagline: "Running 5 containers with 200-character terminal commands is insane. Meet the Conductor: Docker Compose.",
      memeUrl: "https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif",
      memeCaption: "DevOps writing 5 manual 'docker run' commands with 27 flags each vs 1 'docker compose up'",
      content: `
### 🎼 The Chaos of the Solo Instrumentalist
Imagine you are building a modern web application:
1. A React Frontend (Port 80)
2. A Node.js Backend API (Port 5000)
3. A Redis Cache (Port 6379)
4. A PostgreSQL Database (Port 5432)

To start this manually:
\`\`\`bash
docker network create my-net
docker volume create db-data
docker run -d --name db --network my-net -v db-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=pass postgres:16
docker run -d --name redis --network my-net redis:alpine
docker run -d --name api --network my-net -p 5000:5000 -e DB_HOST=db -e REDIS_HOST=redis my-api
docker run -d --name frontend --network my-net -p 80:80 my-frontend
\`\`\`
If you forget one flag, one network, or start the API before the DB is ready, **everything crashes**.

---

### 🪄 The Conductor: \`docker-compose.yml\`
Docker Compose turns imperative manual commands into a **single declarative blueprint**:

\`\`\`yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      REDIS_HOST: redis
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:alpine

volumes:
  pgdata:
\`\`\`

### 📡 The Magic of Automatic DNS
Notice the \`api\` environment variables: \`DB_HOST: db\`!
- Docker Compose automatically creates a custom bridge network for the entire project.
- Docker has an **embedded DNS server at 127.0.0.11**.
- When the Node.js API tries to connect to \`db\`, Docker's DNS immediately translates the service name \`db\` to its private IP \`172.20.0.3\`.
- **Zero hardcoded IP addresses needed!**
      `,
      takeaways: [
        "Docker Compose is declarative: define what you want, let Docker handle execution.",
        "Internal DNS allows services to talk to each other using their service names (e.g. http://api:5000).",
        "Use healthchecks with condition: service_healthy to prevent APIs from booting before databases."
      ]
    }
  ],

  simulatorPresets: {
    "bad-node": {
      title: "❌ The Unoptimized Beginner Dockerfile (Heavy & Cache-Busted)",
      instructions: [
        { cmd: "FROM", arg: "node:22", size: "1120MB", cached: false, note: "Huge Debian base image (1.1GB!)" },
        { cmd: "WORKDIR", arg: "/app", size: "0MB", cached: false, note: "Directory pointer" },
        { cmd: "COPY", arg: ". .", size: "380MB", cached: false, note: "FATAL: Copies code + node_modules! Busts cache every single keystroke!" },
        { cmd: "RUN", arg: "npm install", size: "320MB", cached: false, note: "Re-downloads the entire internet on every single build (45s)!" },
        { cmd: "CMD", arg: '["node", "server.js"]', size: "0MB", cached: false, note: "Entrypoint metadata" }
      ],
      totalSize: "1,820 MB",
      buildTime: "58 seconds",
      rating: "F (Terrible)",
      feedback: "Every code edit forces a full `npm install`. Massive base image has dozens of vulnerabilities."
    },
    "cached-node": {
      title: "⚡ Step 2: Layer Caching Optimized (Fast Iteration)",
      instructions: [
        { cmd: "FROM", arg: "node:22-alpine", size: "135MB", cached: true, note: "Tiny Alpine Linux base image" },
        { cmd: "WORKDIR", arg: "/app", size: "0MB", cached: true, note: "Directory pointer" },
        { cmd: "COPY", arg: "package*.json ./", size: "0.1MB", cached: true, note: "Copied FIRST: Cache only busts when dependencies change!" },
        { cmd: "RUN", arg: "npm ci --only=production", size: "85MB", cached: true, note: "CACHED! Takes 0.0s when code changes!" },
        { cmd: "COPY", arg: ". .", size: "12MB", cached: false, note: "Source code copied AFTER install. Instant rebuilds!" },
        { cmd: "USER", arg: "node", size: "0MB", cached: false, note: "Security: Drops root privileges" },
        { cmd: "CMD", arg: '["node", "server.js"]', size: "0MB", cached: false, note: "Command metadata" }
      ],
      totalSize: "232 MB",
      buildTime: "1.8 seconds",
      rating: "A- (Production Ready)",
      feedback: "Rebuilds are blazing fast because `npm ci` is cached unless you edit package.json!"
    },
    "multistage-pro": {
      title: "🏆 Step 3: Multi-Stage Masterpiece (TypeScript / Built Apps)",
      instructions: [
        { cmd: "# Stage 1", arg: "AS builder", size: "Stage 1", cached: true, note: "Temporary build environment" },
        { cmd: "FROM", arg: "node:22-alpine AS builder", size: "135MB", cached: true, note: "Alpine builder" },
        { cmd: "COPY", arg: "package*.json ./", size: "0.1MB", cached: true, note: "Deps specs" },
        { cmd: "RUN", arg: "npm ci", size: "190MB", cached: true, note: "Installs devDeps (tsc, webpack, linters)" },
        { cmd: "COPY", arg: ". .", size: "15MB", cached: false, note: "Source code" },
        { cmd: "RUN", arg: "npm run build", size: "20MB", cached: false, note: "Compiles TS to JS dist" },
        { cmd: "# Stage 2", arg: "AS runner", size: "Stage 2", cached: true, note: "Fresh tiny production image" },
        { cmd: "FROM", arg: "node:22-alpine AS runner", size: "135MB", cached: true, note: "Zero build tools!" },
        { cmd: "COPY", arg: "--from=builder /app/dist ./dist", size: "4MB", cached: false, note: "Transferred only compiled JS" },
        { cmd: "COPY", arg: "--from=builder /app/node_modules ./node_modules", size: "35MB", cached: false, note: "Production-only libs" },
        { cmd: "USER", arg: "node", size: "0MB", cached: false, note: "Non-root user" },
        { cmd: "CMD", arg: '["node", "dist/index.js"]', size: "0MB", cached: false, note: "Production runtime" }
      ],
      totalSize: "54 MB",
      buildTime: "0.9 seconds",
      rating: "S+ (Gigachad DevOps)",
      feedback: "All compilers, linters, and heavy devDependencies discarded. Final image is only 54 MB!"
    }
  },

  quizChallenges: [
    {
      id: 1,
      title: "The Phantom Port Mystery",
      scenario: "You start an Express API container with `docker run -d my-node-api`. Inside the container, Express logs show `Server running on port 3000`. You open Chrome on your Windows laptop and go to `http://localhost:3000`, but you get 'ERR_CONNECTION_REFUSED'. What happened?",
      memeCorrect: "https://media.giphy.com/media/2bYewTk7K2No1NvcuK/giphy.gif",
      memeWrong: "https://media.giphy.com/media/11StaZ9Lj75oCY/giphy.gif",
      options: [
        "Docker is broken; you must reinstall Docker Desktop.",
        "You forgot to map the port with `-p 3000:3000`. Container ports are isolated by default.",
        "Node.js is not compatible with Windows host networking.",
        "You must run the container with `sudo` permissions."
      ],
      correctIndex: 1,
      explanation: "Containers live in their own private Network Namespace. The container port 3000 is isolated from the host. You MUST use `-p <HostPort>:<ContainerPort>` (e.g. `-p 3000:3000`) so Docker sets up an iptables/NAT forwarding rule from your host to the container!"
    },
    {
      id: 2,
      title: "The Mysterious Exit Code 137",
      scenario: "Your production background worker container suddenly crashes in the middle of processing a heavy image resize job. You run `docker ps -a` and see `Exited (137)`. What does Exit Code 137 mean?",
      memeCorrect: "https://media.giphy.com/media/l4pMattUYTTM7qpIk/giphy.gif",
      memeWrong: "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
      options: [
        "The app had a JavaScript syntax error (SIGSEGV).",
        "The container was killed by Linux OOM (Out Of Memory) killer via SIGKILL (128 + 9 = 137).",
        "Network connection timed out.",
        "The container completed successfully with code 0."
      ],
      correctIndex: 1,
      explanation: "Exit code 137 = 128 + signal 9 (SIGKILL). The Linux Kernel or Docker cgroups killed the container because it exceeded its allocated memory limit (OOMKilled)!"
    },
    {
      id: 3,
      title: "The 3 AM Layer Cache Mystery",
      scenario: "Every time your frontend developer changes a single CSS color in `src/styles.css`, the Docker build takes 4 minutes because it runs `npm install` from scratch. Why is Docker re-running `npm install` every time?",
      memeCorrect: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      options: [
        "Docker can never cache npm install commands.",
        "The Dockerfile had `COPY . .` BEFORE `RUN npm install`. Changing any file invalidates that layer and all subsequent layers!",
        "The CSS file had a syntax error that triggered a cache purge.",
        "Docker daemon needs to be restarted with `docker cache clear`."
      ],
      correctIndex: 1,
      explanation: "Docker caches layers top-down. If you do `COPY . .` before `RUN npm install`, ANY change to ANY file changes the checksum of `COPY . .`, busting the cache for everything below it. Always copy `package*.json` first, run `npm install`, then copy the rest of your files!"
    },
    {
      id: 4,
      title: "The Database Reset Fiasco",
      scenario: "Your colleague deployed MongoDB with `docker run -d --name mongo mongo:7`. Two weeks later, they ran `docker stop mongo && docker rm mongo && docker run -d --name mongo mongo:7`. All user accounts are gone! How do you prevent this?",
      memeCorrect: "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      options: [
        "Set `MONGO_AUTO_SAVE=true` in environment variables.",
        "Attach a named volume: `-v mongo-data:/data/db` to persist files outside container lifecycle.",
        "You can never run databases in Docker.",
        "Use `-d` detached mode, which enables permanent storage."
      ],
      correctIndex: 1,
      explanation: "Containers are ephemeral. Their write-layer is destroyed on `docker rm`. To persist database data, always attach a Docker Volume (`-v my-vol:/data/db`), which stores data safely on the host disk!"
    },
    {
      id: 5,
      title: "The Docker Compose DNS Magic",
      scenario: "In your `docker-compose.yml`, you have a service named `api` and a service named `db`. Inside your API's connection string, what hostname should you use to connect to PostgreSQL?",
      memeCorrect: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xThuW4BaAA2f7nRvoc/giphy.gif",
      options: [
        "`localhost:5432`",
        "`127.0.0.1:5432`",
        "`db:5432` (using the Compose service name as hostname)",
        "The host machine's public Wi-Fi IP address"
      ],
      correctIndex: 2,
      explanation: "Docker Compose creates a user-defined bridge network with automatic service discovery. Docker's embedded DNS resolves the service name `db` directly to that container's internal IP address!"
    },
    {
      id: 6,
      title: "The Zombie PID 1 Apocalypse",
      scenario: "When you run `docker stop my-container`, it freezes for exactly 10 seconds before forcibly shutting down. Why does this delay happen?",
      memeCorrect: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      memeWrong: "https://media.giphy.com/media/l2JdUCgLAYZK595ba/giphy.gif",
      options: [
        "Docker is uploading analytics to Docker Hub.",
        "Node.js or Python is running as PID 1, which ignores SIGTERM by default. Docker waited 10s then sent SIGKILL.",
        "Windows WSL2 always pauses for 10 seconds for file sync.",
        "Docker is creating an image backup automatically."
      ],
      correctIndex: 1,
      explanation: "In Linux, PID 1 has special duties. By default, processes running as PID 1 ignore standard `SIGTERM` signals unless an explicit handler is installed (or an init system like `tini` or `dumb-init` is used). After 10s timeout, Docker gives up and sends uncatchable `SIGKILL`!"
    }
  ],

  commandBuilder: {
    run: {
      description: "Creates and starts a new container from an image.",
      flags: [
        { id: "detached", flag: "-d", name: "Detached Mode (-d)", desc: "Runs container in background so your terminal remains free.", active: true },
        { id: "autorm", flag: "--rm", name: "Auto Remove (--rm)", desc: "Deletes container automatically upon exit (keeps disk clean).", active: true },
        { id: "port", flag: "-p 8080:80", name: "Port Forward (-p 8080:80)", desc: "Maps Host Port 8080 -> Container Port 80.", active: true },
        { id: "name", flag: "--name my-web-app", name: "Name (--name)", desc: "Assigns a friendly name instead of random funny names.", active: true },
        { id: "volume", flag: "-v app-data:/data", name: "Named Volume (-v)", desc: "Persists data permanently to host volume 'app-data'.", active: false },
        { id: "env", flag: "-e NODE_ENV=production", name: "Environment (-e)", desc: "Injects runtime configuration environment variable.", active: false },
        { id: "mem", flag: "-m 512m", name: "Memory Limit (-m 512m)", desc: "Cgroups cap: Prevents memory leak from freezing host computer.", active: false },
        { id: "restart", flag: "--restart unless-stopped", name: "Auto-Restart Policy", desc: "Restarts container if it crashes or system reboots.", active: false }
      ],
      image: "nginx:alpine"
    }
  }
};
