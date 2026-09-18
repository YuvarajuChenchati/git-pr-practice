# 🐬 Exercise 01: MySQL Container Mastery, Raw SQL Queries & Volume Durability

> **The Story:**  
> It was Black Friday at midnight. A fast-growing e-commerce startup launched their holiday sale. At 2:15 AM, the server ran low on memory, and the Linux kernel killed the MySQL database container.  
> The junior engineer breathed a sigh of relief: *"Don't worry, Docker restart policies will automatically restart it!"*  
> The container restarted. But when customers refreshed the checkout page, every shopping cart, customer record, and order history had vanished. Over $1.2 million in sales was gone.  
> **Why?** The container had been created without a volume. When the container was recreated, its ephemeral writable layer was wiped clean.  
> In this exercise, you will reproduce this exact disaster, understand the internal mechanics, and master Docker volumes so you never lose data again.

---

## 🎯 Learning Objectives
By completing this exercise, you will master:
1. Running production MySQL 8.0 containers with required environment variables.
2. Executing interactive SQL shells directly inside a running container using `docker exec`.
3. Creating databases, tables, and populating persistent records.
4. **The Disaster Simulation**: Proving that containers without volumes lose all data on recreation.
5. **The Enterprise Solution**: Creating and mounting Named Docker Volumes (`-v volume_name:/var/lib/mysql`).
6. Verifying 100% data survival across container destruction.
7. Inspecting volume storage on host and taking hot backups with snapshot containers.

---

## 🔬 Core Concept: Container Layers vs Persistent Volumes

```
WITHOUT VOLUME (Ephemeral OverlayFS):
┌─────────────────────────────────────────────────────────┐
│ Container Write Layer (Temporary - Deleted on 'rm')     │ ➔ Writes /var/lib/mysql here 💥 Wiped on rm!
├─────────────────────────────────────────────────────────┤
│ Image Layers (Read-Only: mysql:8.0)                     │
└─────────────────────────────────────────────────────────┘

WITH NAMED VOLUME (Bypasses OverlayFS):
┌─────────────────────────────────────────────────────────┐
│ Container Process (mysqld)                              │
└───────────────────────────┬─────────────────────────────┘
                            │ Mount Point: /var/lib/mysql
                            ▼
┌─────────────────────────────────────────────────────────┐
│ Host Disk Storage (/var/lib/docker/volumes/mysql_data)  │ ➔ Safe forever on Host! 🛡️
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Step-by-Step Practical Lab

### Phase 1: The Ephemeral MySQL Container (The Disaster Setup)

1. Launch a MySQL 8.0 container **without** mounting any volume:
   ```powershell
   docker run -d `
     --name temp_mysql `
     -e MYSQL_ROOT_PASSWORD=SuperSecretPass123 `
     -e MYSQL_DATABASE=company_db `
     -p 3306:3306 `
     mysql:8.0
   ```

2. Check container status and wait until MySQL completes its internal initialization (about 10-15 seconds):
   ```powershell
   docker logs -f temp_mysql
   ```
   *(Press `Ctrl+C` once you see `mysqld: ready for connections`)*

---

### Phase 2: Interacting via SQL Inside the Container

1. Open an interactive MySQL shell inside the running container:
   ```powershell
   docker exec -it temp_mysql mysql -u root -pSuperSecretPass123 company_db
   ```

2. Inside the MySQL prompt, create an `employees` table and insert records:
   ```sql
   CREATE TABLE employees (
       id INT AUTO_INCREMENT PRIMARY KEY,
       full_name VARCHAR(100) NOT NULL,
       department VARCHAR(50) NOT NULL,
       salary DECIMAL(10, 2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   INSERT INTO employees (full_name, department, salary) VALUES
   ('Alice Johnson', 'Site Reliability Engineering', 145000.00),
   ('Bob Smith', 'Backend Architecture', 135000.00),
   ('Carol Danvers', 'DevOps Security', 150000.00);

   -- Verify records
   SELECT * FROM employees;
   ```

3. Exit the MySQL shell:
   ```sql
   EXIT;
   ```

---

### Phase 3: Triggering the Catastrophe (Container Destruction)

1. Now simulate a crash or an accidental container deletion:
   ```powershell
   docker stop temp_mysql
   docker rm temp_mysql
   ```

2. Now spin up a brand new container with the exact same name and image:
   ```powershell
   docker run -d `
     --name temp_mysql `
     -e MYSQL_ROOT_PASSWORD=SuperSecretPass123 `
     -e MYSQL_DATABASE=company_db `
     -p 3306:3306 `
     mysql:8.0
   ```

3. Wait 10 seconds, then check the database:
   ```powershell
   docker exec -it temp_mysql mysql -u root -pSuperSecretPass123 company_db -e "SHOW TABLES; SELECT * FROM employees;"
   ```

4. **Result:**
   ```text
   ERROR 1146 (42S02) at line 1: Table 'company_db.employees' doesn't exist
   ```
   🚨 **All data was completely erased!** Because Docker containers use a copy-on-write ephemeral storage layer, removing the container destroys all disk modifications made inside it.

---

### Phase 4: The Production Fix — Docker Named Volumes

1. Clean up the ephemeral container:
   ```powershell
   docker rm -f temp_mysql
   ```

2. Create a dedicated, managed Docker Named Volume:
   ```powershell
   docker volume create mysql_enterprise_storage
   docker volume ls
   ```

3. Inspect the volume details:
   ```powershell
   docker volume inspect mysql_enterprise_storage
   ```
   *(Notice the `Mountpoint`. On Linux/WSL2, this directory lives safely on the host filesystem isolated from container lifecycles!)*

4. Run MySQL and mount the volume to `/var/lib/mysql` (MySQL's default storage directory):
   ```powershell
   docker run -d `
     --name prod_mysql `
     -v mysql_enterprise_storage:/var/lib/mysql `
     -e MYSQL_ROOT_PASSWORD=SuperSecretPass123 `
     -e MYSQL_DATABASE=company_db `
     -p 3306:3306 `
     mysql:8.0
   ```

5. Wait for MySQL to initialize (`docker logs -f prod_mysql`), then insert the business-critical records:
   ```powershell
   docker exec -it prod_mysql mysql -u root -pSuperSecretPass123 company_db
   ```

   ```sql
   CREATE TABLE employees (
       id INT AUTO_INCREMENT PRIMARY KEY,
       full_name VARCHAR(100) NOT NULL,
       department VARCHAR(50) NOT NULL,
       salary DECIMAL(10, 2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   INSERT INTO employees (full_name, department, salary) VALUES
   ('Alice Johnson', 'Site Reliability Engineering', 145000.00),
   ('Bob Smith', 'Backend Architecture', 135000.00),
   ('Carol Danvers', 'DevOps Security', 150000.00);

   SELECT * FROM employees;
   EXIT;
   ```

---

### Phase 5: The Ultimate Durability Test

1. Completely eradicate the container:
   ```powershell
   docker rm -f prod_mysql
   ```

2. Verify that the container is completely dead:
   ```powershell
   docker ps -a --filter name=prod_mysql
   ```

3. Now, spin up an **entirely new container** (let's even give it a different name: `prod_mysql_replacement` or upgrade the minor version!) pointing to the **same volume**:
   ```powershell
   docker run -d `
     --name prod_mysql_replacement `
     -v mysql_enterprise_storage:/var/lib/mysql `
     -e MYSQL_ROOT_PASSWORD=SuperSecretPass123 `
     -e MYSQL_DATABASE=company_db `
     -p 3306:3306 `
     mysql:8.0
   ```

4. Query the table immediately:
   ```powershell
   docker exec -it prod_mysql_replacement mysql -u root -pSuperSecretPass123 company_db -e "SELECT * FROM employees;"
   ```

5. **Result:**
   ```text
   +----+---------------+--------------------------------+-----------+---------------------+
   | id | full_name     | department                     | salary    | created_at          |
   +----+---------------+--------------------------------+-----------+---------------------+
   |  1 | Alice Johnson | Site Reliability Engineering   | 145000.00 | 2026-09-18 06:40:12 |
   |  2 | Bob Smith     | Backend Architecture           | 135000.00 | 2026-09-18 06:40:12 |
   |  3 | Carol Danvers | DevOps Security                | 150000.00 | 2026-09-18 06:40:12 |
   +----+---------------+--------------------------------+-----------+---------------------+
   ```
   🎉 **100% DATA SURVIVAL!** The container is ephemeral, but your state is immutable and durable!

---

### Phase 6: Pro SRE Skill — Hot Backup of Docker Volumes

How do DevOps engineers backup Docker volumes without installing backup agents on the host?  
Using an **ephemeral backup container**:

```powershell
# Create a backup folder on your host machine
mkdir backup -Force

# Launch a tiny Alpine container that mounts the volume and the host folder, then creates a tarball
docker run --rm `
  -v mysql_enterprise_storage:/volume_data:ro `
  -v ${PWD}/backup:/backup `
  alpine tar -czvf /backup/mysql_backup.tar.gz -C /volume_data .
```

Verify your backup archive:
```powershell
Get-ChildItem ./backup
```
You now have a compressed `.tar.gz` containing the entire MySQL database data directory ready for off-site S3 storage!

---

### 🧹 Clean Up
```powershell
docker rm -f prod_mysql_replacement
docker volume rm mysql_enterprise_storage
Remove-Item -Recurse -Force ./backup
```
