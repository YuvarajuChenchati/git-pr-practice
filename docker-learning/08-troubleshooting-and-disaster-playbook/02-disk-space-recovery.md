# 🧹 Disk Space Recovery & Overlay2 Cleanup Guide

A common Docker issue on development and production servers is **"No space left on device"** or Docker eating 50+ GB of hard drive space.
Here is how to reclaim your disk space without breaking running apps.

---

## 📊 Step 1: See What is Consuming Disk Space

Run:
```powershell
docker system df
```

Example output:
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          12        2         4.8GB     3.9GB (81%)
Containers      8         1         120MB     110MB (91%)
Local Volumes   6         1         15.2GB    12.8GB (84%)
Build Cache     45        0         22.1GB    22.1GB (100%)
```

Notice **Build Cache** and **Unused Volumes** often consume 80%+ of disk space!

---

## 🧼 Step 2: Safe Targeted Cleanups

### Clean Old Build Caches (Safe)
Docker BuildKit caches intermediate layers:
```powershell
docker builder prune -f
```

### Clean Dangling & Stopped Containers (Safe)
```powershell
docker container prune -f
```

### Clean Unused Images
Remove images not currently used by any running container:
```powershell
docker image prune -a -f
```

---

## 💣 Step 3: The Nuclear Option (Reclaim Maximum Space)

> [!WARNING]
> This command deletes **ALL** stopped containers, all unused networks, all images without at least one container, and all build cache.
> It will NOT delete named volumes unless you explicitly add `--volumes`.

```powershell
docker system prune -a --volumes
```
This single command often reclaims **20 to 50 GB** of storage in under 10 seconds!
