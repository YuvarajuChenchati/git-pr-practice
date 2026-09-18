# 🕵️ Advanced Live Container Debugging Techniques

Senior engineers don't just guess; they use these 4 surgical diagnostic commands:

---

## 1. `docker cp`: Rescue or Inject Files
You don't need an SSH server inside a container to copy files!
You can copy files in or out of **ANY** container (even if it's currently stopped!).

```powershell
# Copy a log or database file OUT of a container to your host:
docker cp my-node-container:/app/server.js ./extracted-server.js

# Copy a config file from your host INTO a running container:
docker cp ./my-custom-config.json my-node-container:/app/config.json
```

---

## 2. `docker diff`: The "What Changed?" Inspector
Every container has a thin read-write layer on top of the read-only image layers.
To see every single file created, modified, or deleted by the container:

```powershell
docker diff my-node-container
```

Legend:
- `A` = File Added
- `C` = File Changed
- `D` = File Deleted

---

## 3. `docker top`: Inspect Real OS Processes
See the actual Linux processes and their **Host OS PIDs**:
```powershell
docker top my-node-container
```

---

## 4. `docker inspect`: The Full JSON Spec
Filter specific values with Go template formatting:
```powershell
# Get container IP address:
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-node-container

# Get container start time and restart count:
docker inspect -f 'Started: {{.State.StartedAt}}, Restarts: {{.RestartCount}}' my-node-container
```
