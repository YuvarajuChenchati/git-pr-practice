# 🌐 Exercise 03: Crazy-Level 3-Tier Enterprise Stack with Docker Compose
### Nginx (Reverse Proxy) + Node.js (API) + Redis (Cache) + MySQL (Database)

> **The Story:**  
> In 2018, a major ticket booking platform crashed 15 seconds after tickets for a world tour went on sale.  
> 250,000 concurrent fans flooded the backend. The single Node.js process choked on SSL handshakes, static images, and direct SQL queries:  
> `SELECT * FROM seats WHERE status='available'` executed 85,000 times per second directly against MySQL.  
> The database CPU hit 100%, deadlocks occurred, connection pools exhausted, and the entire platform died.  
> **The Modern 3-Tier Architecture Solution:**  
> 1. **Nginx** handles TLS/SSL, serves static assets at lightning C-speed, and load balances API traffic.  
> 2. **Redis** caches hot seat data in RAM with sub-millisecond responses, absorbing 95% of incoming reads.  
> 3. **Node.js** processes business logic and writes only confirmed transactions.  
> 4. **MySQL** persists final relational state safely to disk without melting down.

---

## 🏗️ The Architectural Blueprint & Zero-Trust Dual Network

In a production environment, **security segmentation is mandatory**.  
Public internet traffic should **NEVER** have direct network access to your database or cache!

```
                    Internet (Client Browser)
                               │
                      [ Port 80 / 443 ]
                               ▼
            ┌──────────────────────────────────────┐
            │  Tier 1: Nginx Reverse Proxy         │
            └──────────────────┬───────────────────┘
                               │
              🌐 Network: `frontend_net` (Isolated)
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │  Tier 2: Node.js Express API Engine  │
            └──────────────────┬───────────────────┘
                               │
              🔒 Network: `backend_net` (Zero-Trust Internal)
                     ┌─────────┴─────────┐
                     ▼                   ▼
            ┌─────────────────┐ ┌─────────────────┐
            │ Tier 3: Redis   │ │ Tier 4: MySQL   │
            │ In-Memory Cache │ │ Relational DB   │
            └─────────────────┘ └─────────────────┘
```
> [!IMPORTANT]
> Notice that `db` and `redis` are **only** on `backend_net`.  
> Even if a hacker compromises `nginx`, they have **no route** to ping `mysql` or `redis` because they do not share a network namespace!

---

## 🔍 Why Do We Use Each Component? (The "Why" Matrix)

| Component | Role | Why Not Direct? | Production Benefit |
|---|---|---|---|
| **Nginx** | Reverse Proxy & Web Server | Clients should never touch Node.js directly. | SSL termination, DDoS protection, gzip/brotli compression, rate limiting, and zero-downtime blue-green routing. |
| **Node.js** | Application Logic Tier | Pure compute engine. | Connects business logic, parses JSON, handles authentication, talks to cache and DB. |
| **Redis** | High-Speed Cache (RAM) | MySQL disk reads take 5–50ms. Redis RAM reads take 0.2ms! | Absorbs read-heavy spikes (cache-aside pattern), stores user sessions, handles rate limiting counters. |
| **MySQL** | Relational Database (Disk) | Redis is RAM; if it restarts without RDB/AOF, data vanishes. | ACID-compliant source of truth with durable Named Volume storage. |

---

## 📄 The Crazy-Level `docker-compose.yml`

Here is the production-ready compose configuration demonstrating healthchecks, dual-network segmentation, environment propagation, and volume mounts:

```yaml
version: '3.8'

services:
  # ============================================================================
  # TIER 1: NGINX REVERSE PROXY & GATEWAY
  # ============================================================================
  gateway:
    image: nginx:alpine
    container_name: enterprise_gateway
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      api:
        condition: service_started
    networks:
      - frontend_net
    restart: always

  # ============================================================================
  # TIER 2: NODE.JS BACKEND API
  # ============================================================================
  api:
    image: node:20-alpine
    container_name: enterprise_api
    working_dir: /app
    volumes:
      - ./api:/app
    environment:
      PORT: 3000
      DB_HOST: db
      DB_USER: app_user
      DB_PASSWORD: app_secret_password
      DB_NAME: enterprise_db
      REDIS_HOST: cache
      REDIS_PORT: 6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - frontend_net
      - backend_net
    command: ["sh", "-c", "npm install && node server.js"]
    restart: unless-stopped

  # ============================================================================
  # TIER 3: REDIS IN-MEMORY CACHE
  # ============================================================================
  cache:
    image: redis:7-alpine
    container_name: enterprise_cache
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - backend_net
    restart: unless-stopped

  # ============================================================================
  # TIER 4: MYSQL RELATIONAL DATABASE
  # ============================================================================
  db:
    image: mysql:8.0
    container_name: enterprise_db
    environment:
      MYSQL_ROOT_PASSWORD: root_super_secret
      MYSQL_DATABASE: enterprise_db
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_secret_password
    volumes:
      - mysql_storage:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_super_secret"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 15s
    networks:
      - backend_net
    restart: unless-stopped

# ==============================================================================
# PERSISTENT VOLUMES
# ==============================================================================
volumes:
  mysql_storage:
    name: enterprise_mysql_storage
  redis_data:
    name: enterprise_redis_storage

# ==============================================================================
# NETWORK SEGMENTATION
# ==============================================================================
networks:
  frontend_net:
    driver: bridge
  backend_net:
    driver: bridge
```

---

## ⚡ Mastering Docker Compose Commands at a Crazy Level

### 1. The Startup Masterclasses
- **`docker compose up -d`**:  
  Runs all containers in the background (detached mode). Recreates only containers whose configuration or image changed.
- **`docker compose up -d --build`**:  
  **Mandatory after code changes!** Forces Docker to rebuild local images before spinning up services.
- **`docker compose up --scale api=3 -d`**:  
  Instantly spins up 3 replicated API containers for load balancing behind Nginx!

### 2. Live Diagnostics & Inspection
- **`docker compose ps`**:  
  Lists all services, their current state (`running`, `healthy`, `restarting`), and port mappings.
- **`docker compose logs -f api`**:  
  Follows live standard output/errors for the `api` service specifically.
- **`docker compose top`**:  
  Displays the live host OS process IDs (`PID`, `UID`, CPU consumption) of all processes running inside your compose stack!
- **`docker compose exec -it db mysql -u root -proot_super_secret`**:  
  Directly executes an interactive shell inside the database without exposing port 3306 to the host machine!

### 3. The Teardown Matrix (Danger Zone ⚠️)
- **`docker compose stop`**:  
  Stops containers without deleting them. Preserves container writable layer, networks, and volumes.
- **`docker compose down`**:  
  Stops and deletes containers and default networks. **Keeps your named volumes completely safe!**
- **`docker compose down -v`**:  
  🚨 **THE NUCLEAR TEARDOWN.** Deletes containers, networks, AND **all named volumes (`mysql_storage`, `redis_data`)**. Use only when you want a completely clean, blank database slate!

---

## 🏆 Practical Verification Lab

To test this complete stack right now, go into `04-docker-compose/project-03-fullstack-ecommerce`:
```powershell
cd C:\Users\chyuv\Desktop\Practice\docker-learning\04-docker-compose\project-03-fullstack-ecommerce
docker compose up -d --build
docker compose ps
```
Open your browser at `http://localhost:8080`.  
You will see Nginx reverse-proxying into Express, fetching products from MySQL, caching queries in Redis, and reporting health status in real time!
