# 🧪 Project 03 Walkthrough: Orchestrating Full-Stack eCommerce

### Step 1: Start the Entire Multi-Container Stack
In PowerShell:
```powershell
cd c:\Users\chyuv\Desktop\Practice\docker-learning\04-docker-compose\project-03-fullstack-ecommerce
docker compose up -d --build
```

---

### Step 2: Check Status & Health
```powershell
docker compose ps
```
You will see all 4 services running. Notice `(healthy)` next to `db` and `redis`!

---

### Step 3: Open the Store in Browser
Navigate in your browser to:
👉 **`http://localhost:8080`**

What you will see:
1. The modern glassmorphic storefront.
2. The green badge: `● All 4 Services Healthy`.
3. The catalog populated with courses from MySQL and cached into Redis.
4. Click **"Purchase Item"**:
   - Sends a POST request through Nginx ➔ Express Backend.
   - Updates inventory in MySQL transaction.
   - Clears Redis cache.
   - Stock count updates dynamically on your screen!

---

### Step 4: View Real-Time Microservice Logs
Stream logs for just the backend:
```powershell
docker compose logs -f backend
```
Or for all services:
```powershell
docker compose logs -f
```

---

### Step 5: Stop the Stack
```powershell
docker compose down
```
*(To remove the persistent database volume as well for a fresh reset, run `docker compose down -v`)*.
