# Lab 01: Volume Persistence Test

### Objective
Prove that data stored inside a Docker volume survives even when the container is deleted and replaced.

---

### Step 1: Create a Named Volume
In PowerShell:
```powershell
docker volume create test_data_volume
docker volume ls
```

---

### Step 2: Write data from Container #1
Run an alpine container that mounts this volume to `/data` and writes a file:
```powershell
docker run --rm -v test_data_volume:/data alpine sh -c "echo 'Persistence confirmed at $(date)' > /data/secret.txt"
```
Notice `--rm` was used. As soon as the command finished, this container was **completely destroyed**!

---

### Step 3: Read data from Container #2
Now start a completely different container mounting the same volume:
```powershell
docker run --rm -v test_data_volume:/data alpine cat /data/secret.txt
```
Output:
`Persistence confirmed at ...`

The data survived! This is exactly how production databases (Postgres, MySQL, MongoDB) maintain state in Docker and Kubernetes.

---

### Step 4: Cleanup
```powershell
docker volume rm test_data_volume
```
