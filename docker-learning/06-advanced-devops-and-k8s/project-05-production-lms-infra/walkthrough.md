# 🧪 Project 05 Walkthrough: Production LMS Infrastructure

### Step 1: Run the Production Hardened LMS Stack
In PowerShell:
```powershell
cd c:\Users\chyuv\Desktop\Practice\docker-learning\06-advanced-devops-and-k8s\project-05-production-lms-infra
docker compose -f docker-compose.prod.yml up -d
```

---

### Step 2: Verify Health & Resource Constraints
Check status:
```powershell
docker compose -f docker-compose.prod.yml ps
```
Notice `(healthy)`!

Check the container's live resource ceiling:
```powershell
docker stats lms_production_api --no-stream
```
Notice `LIMIT` is strictly capped at `256MiB`!

---

### Step 3: Test Health Endpoint
```powershell
curl http://localhost:3000
```
Output:
`{"status":"LMS API Operational","node":"v22.x.x"}`

---

### Step 4: Cleanup
```powershell
docker compose -f docker-compose.prod.yml down
```

🎉 **You have mastered the entire curriculum from Zero to Production!**
