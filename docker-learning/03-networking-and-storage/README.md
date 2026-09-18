# 🌐 Module 03: Docker Networking & Storage Mastery

> *"Containers are like hotel rooms. If you leave your wallet on the nightstand and check out, it's gone forever."*  
> — The Law of Container Ephemerality 🏨

---

## 😱 The Horror Story: The Amnesiac Database

Imagine you deployed a production MongoDB database using:
```bash
docker run -d --name production-mongo -p 27017:27017 mongo:7
```
For three weeks, 15,000 customers signed up, placed orders, and added credit cards.
Then on a Tuesday night, Docker Desktop received an update and restarted:
```bash
# Developer cleans up the stopped container and starts a fresh one:
docker rm production-mongo
docker run -d --name production-mongo -p 27017:27017 mongo:7
```
**THE DISASTER**:
The database was 100% empty. Zero users. Zero orders. All data was completely wiped out.

### Why Did This Happen?
A container's filesystem is **ephemeral (temporary)**.
- Any file created while the container is running is written to the thin **Read-Write layer**.
- When you run `docker rm`, that Read-Write layer is permanently deleted from the disk.
- Containers are designed to be **cattle, not pets**. If a container dies, you should be able to destroy it without losing precious state!

---

## 💾 The 3 Storage Mechanisms Demystified

To give containers permanent memory, we punch a hole through the container filesystem into the host:

```
+-----------------------------------------------------------------------+
| HOST FILE SYSTEM                                                      |
|                                                                       |
|  [Docker Internal Managed Area]          [Your Local Workspace]       |
|  /var/lib/docker/volumes/my-db-data      C:\Users\chyuv\Practice\src  |
|             │                                         │               |
|       (NAMED VOLUME)                            (BIND MOUNT)          |
|       ⚓ Production Gold Standard                ⚡ Hot Reload Dev      |
|             │                                         │               |
|  +----------▼-------------------+     +---------------▼-------------+ |
|  | Container: postgres          |     | Container: express-api      | |
|  | Path: /var/lib/postgresql    |     | Path: /app/src              | |
|  | (Survives container removal! |     | (Edit in VS Code ->         | |
|  |  Re-attaches in 1 second)    |     |  Reflects immediately!)     | |
|  +------------------------------+     +-----------------------------+ |
+-----------------------------------------------------------------------+
```

### 1. Named Volumes (`-v my-vol:/path/in/container`)
- **Managed by Docker**: Stored in a dedicated, high-performance host directory.
- **Production Standard**: Completely decoupled from container lifecycle. Destroying the container **NEVER** touches the volume!
- **Example**:
  ```bash
  docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16
  ```

### 2. Bind Mounts (`-v ${PWD}/src:/app/src`)
- **Direct Link**: Maps an exact folder from your local laptop into the container.
- **Developer Superpower**: When you edit a React or Node.js file on Windows in VS Code, the running container sees the changes instantly! No need to rebuild the Docker image!

### 3. Tmpfs Mounts (`--tmpfs /tmp`)
- Stored exclusively in host system **RAM**.
- Ultra-fast, zero disk writes, completely wiped on stop. Ideal for sensitive API keys or temporary session caches.

---

## 📡 Docker Networking: The Walkie-Talkie & The Embedded DNS

Why can't containers talk to each other by default?

### ⚠️ The Default Bridge Trap (The #1 Junior Gotcha):
If you run two containers without creating a network:
```bash
docker run -d --name web nginx
docker run -d --name api node-api
```
- They are placed on the `default bridge` network (`bridge`).
- **THE TRAP**: The default bridge **DOES NOT SUPPORT AUTOMATIC DNS RESOLUTION!**
- If your `api` tries to `curl http://web`, it fails with `Could not resolve host: web`!

### 🏆 The User-Defined Custom Bridge (The Senior Pattern):
When you create your own custom bridge network:
```bash
docker network create ecommerce-mesh
docker run -d --name db --network ecommerce-mesh postgres:16
docker run -d --name api --network ecommerce-mesh -p 3000:3000 my-api
```

### 🪄 The Embedded DNS Server (`127.0.0.11`):
1. Inside user-defined networks, Docker spins up an embedded DNS server at `127.0.0.11`.
2. When the Node.js API connects to `db:5432`, its network stack asks `127.0.0.11`: *"What is the IP of 'db'?"*
3. Docker DNS immediately answers: *"It is 172.20.0.3"*.
4. Connection established! **Zero hardcoded IP addresses!**

---

## 🧪 Hands-On Labs in this Module

1. **[Lab 1: Volume Persistence Test](./labs/01-volume-persistence-test.md)**
   - Create tables in MySQL, destroy the container with `docker rm -f`, spin up a replacement container, and witness all data re-appear untouched!
2. **[Lab 2: Manual Network Linking & DNS Probe](./labs/02-manual-network-linking.md)**
   - Create custom bridge networks, use `nslookup` and `ping` between isolated containers, and trace DNS queries to `127.0.0.11`.
3. **[Lab 3: MySQL Queries & Volume Durability (Disaster Simulation & Hot Backup)](./labs/03-mysql-volume-persistence-exercise.md)**
   - Run interactive MySQL containers, execute raw SQL statements, simulate complete data loss without volumes, prove 100% durability with Named Volumes, and take hot volume tar backups!
4. **[Lab 4: The 4 Docker Network Drivers Deep Dive](./labs/04-network-drivers-comparison-lab.md)**
   - Compare `bridge`, `host`, `none`, and `macvlan`. Test air-gapped security and zero-NAT performance.
5. **[Project 2: Node.js + MySQL + Redis Stack](./project-02-nodejs-mysql-redis/)**
   - Wire a complete multi-tier stack with custom bridge networks, database volumes, and cache layers.
