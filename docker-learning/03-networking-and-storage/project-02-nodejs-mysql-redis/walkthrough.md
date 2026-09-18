# 🧪 Project 02 Walkthrough: Multi-Container Networking & Persistence

### The Objective
Run a real 3-tier backend:
- **Node.js Express API**
- **MySQL 8.0** Database
- **Redis** In-Memory Cache

All talking over a private Docker bridge network called `microservice-net`!

---

### Step 1: Run the Stack
You can run `run-stack.ps1` in PowerShell:
```powershell
cd c:\Users\chyuv\Desktop\Practice\docker-learning\03-networking-and-storage\project-02-nodejs-mysql-redis
.\run-stack.ps1
```

Or run the commands manually one-by-one:
```powershell
docker network create microservice-net
docker volume create mysql_store

docker run -d --name redis-cache --network microservice-net redis:alpine

docker run -d --name mysql-db --network microservice-net `
  -e MYSQL_ROOT_PASSWORD=root_secret `
  -e MYSQL_DATABASE=app_database `
  -e MYSQL_USER=app_user `
  -e MYSQL_PASSWORD=app_secret123 `
  -v mysql_store:/var/lib/mysql `
  mysql:8.0

# Build and run API
docker build -t microservice-api:v1 ./api
docker run -d --name microservice-api --network microservice-net -p 3000:3000 microservice-api:v1
```

---

### Step 2: Test Caching in Action
1. Open your browser or curl:
   ```powershell
   curl http://localhost:3000/users
   ```
   First request output:
   `"source": "🗄️ MYSQL DATABASE QUERY (Cache Miss)", "durationMs": 42`

2. Refresh immediately:
   ```powershell
   curl http://localhost:3000/users
   ```
   Second request output:
   `"source": "⚡ REDIS CACHE HIT", "durationMs": 2`

Notice the response time dropped from **42ms** to **2ms**!

---

### Step 3: Test Persistence
Stop and destroy the MySQL container:
```powershell
docker stop mysql-db
docker rm mysql-db
```
Now start a new MySQL container mounting the SAME `mysql_store` volume:
```powershell
docker run -d --name mysql-db --network microservice-net `
  -e MYSQL_ROOT_PASSWORD=root_secret `
  -e MYSQL_DATABASE=app_database `
  -e MYSQL_USER=app_user `
  -e MYSQL_PASSWORD=app_secret123 `
  -v mysql_store:/var/lib/mysql `
  mysql:8.0
```
Query the API again:
```powershell
curl http://localhost:3000/users
```
Your users are still there! The database data remained intact inside `mysql_store`.

---

### Step 4: Cleanup
```powershell
docker stop microservice-api redis-cache mysql-db
docker rm microservice-api redis-cache mysql-db
docker volume rm mysql_store
docker network rm microservice-net
```

---

### 💡 Why Docker Compose was Invented:
Notice how many manual commands and terminal flags we just typed?
Remembering container names, networks, volume mounts, passwords, and order of startup in pure CLI is painful and error-prone.

That is why **Docker Compose** exists!
Now move to [Module 04: Docker Compose](../../04-docker-compose/README.md) to see how 1 single file manages this entire stack declaratively!
