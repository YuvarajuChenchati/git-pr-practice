# 🎯 Top 25 Docker & DevOps Interview Questions & Answers

### 1. What is the fundamental difference between a VM and a Docker container?
A Virtual Machine virtualizes hardware and runs a full guest operating system on top of a hypervisor. A Docker container virtualizes the OS kernel, sharing the host Linux kernel while using Linux **Namespaces** (for isolation) and **Cgroups** (for resource limitation). Containers start in milliseconds and use megabytes instead of gigabytes.

### 2. What are Linux Namespaces and Cgroups?
- **Namespaces**: Provide isolation (PID, NET, MNT, IPC, UTS, USER). What the process can *see*.
- **Cgroups (Control Groups)**: Provide resource metering and limitation (CPU, Memory, Disk I/O). What the process can *use*.

### 3. What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?
- `ENTRYPOINT`: Specifies the fixed command/executable that always runs (e.g. `dumb-init`, `python`, or `nginx`).
- `CMD`: Provides default arguments that can be overridden easily from the CLI:
  ```bash
  ENTRYPOINT ["python", "app.py"]
  CMD ["--port", "8080"]
  # Running: docker run my-image --port 9090 overrides CMD but keeps ENTRYPOINT!
  ```

### 4. What is the difference between `ADD` and `COPY`?
`COPY` simply copies local files from the build context into the container.
`ADD` does everything `COPY` does, plus automatically unpacks `.tar.gz` archives and can download files from URLs.
**Best Practice**: Always use `COPY` unless you explicitly need auto-tar extraction.

### 5. Why should you avoid running containers as the `root` user?
If an attacker finds a remote code execution (RCE) vulnerability inside an application running as root, any container breakout (like a kernel exploit or volume mount vulnerability) grants them root access over the host machine. Adding `USER node` restricts privileges.

### 6. What is a Multi-Stage Build and why is it used?
It allows using multiple `FROM` statements in a single Dockerfile. Heavy compilers, SDKs, linters, and devDependencies are used in Stage 1, and only the compiled output/runtime dependencies are copied to Stage 2. This shrinks image sizes by 90%+ and increases security.

### 7. What is the difference between `docker stop` and `docker kill`?
- `docker stop`: Sends a `SIGTERM` signal to PID 1, giving it a grace period (default 10s) to finish requests, close database connections, and exit cleanly. If it fails, it sends `SIGKILL`.
- `docker kill`: Immediately sends `SIGKILL`, terminating the process instantly without cleanup.

### 8. What is the difference between a Bind Mount and a Named Volume?
- **Named Volume**: Managed completely by the Docker daemon in `/var/lib/docker/volumes/`. High performance, isolated from host OS permissions, ideal for databases in production.
- **Bind Mount**: Directly maps a specific folder on your host machine into the container. Ideal for local live-reload development.

### 9. Why does `depends_on` alone not guarantee database connectivity in Docker Compose?
`depends_on` only waits for the database container to *start*, not for MySQL/PostgreSQL to finish initializing its internal engine. You must pair it with a `healthcheck` and `condition: service_healthy`.

### 10. How do containers communicate on the same custom bridge network?
Docker runs an embedded DNS server at `127.0.0.11` inside user-defined bridge networks. Containers resolve other containers by their container name or service name as hostnames.

### 11. How does Docker's layer caching work, and what causes cache invalidation?
Each instruction (`RUN`, `COPY`, `ADD`) creates an immutable layer stored by content hash. If an instruction or the files it copies change, that layer's cache is invalidated. **Crucially, all subsequent layers below it are also invalidated and must re-run.** This is why `COPY package*.json ./` and `RUN npm install` should always precede `COPY . .`.

### 12. Why should you always include a `.dockerignore` file?
Without `.dockerignore`, Docker sends the entire directory to the Docker daemon as the build context. This needlessly sends large directories like `node_modules` (which may have incompatible host OS native binaries), `.git` folders (leaking git history and inflating context size by hundreds of megabytes), and secret files like `.env`.

### 13. What is the "PID 1 Problem" in Docker containers, and how is it solved?
Inside a container, the main process runs as Process ID 1. In standard Linux, PID 1 (systemd/init) is responsible for reaping orphan zombie child processes and forwarding OS signals (`SIGTERM`, `SIGINT`). Runtimes like Node.js or Python do not reap zombies and ignore `SIGTERM` by default. Using an init tool like `dumb-init` or Docker's `--init` flag ensures clean signal propagation and graceful termination.

### 14. What are the different Docker network drivers?
- **bridge** (Default): Private virtual network with internal NAT; containers get private IPs and communicate across the bridge.
- **host**: Removes network isolation between the container and host; container shares the host's network stack directly (maximum network throughput, but port conflicts are shared with the host).
- **overlay**: Connects multiple Docker daemons across different hosts (used in Docker Swarm and cluster setups).
- **macvlan**: Assigns a real MAC address to the container, making it appear as a physical device on your router's LAN.
- **none**: Completely disables networking for isolated or air-gapped tasks.

### 15. What happens when a container runs out of memory (OOM)?
When a container exceeds its memory limit (set by `--memory`), the Linux kernel's Out-Of-Memory (OOM) Killer terminates the offending process inside the container. The container exits immediately with code **137** (`128 + 9 (SIGKILL)`). You can verify this using `docker inspect <container> --format='{{.State.OOMKilled}}'`.

### 16. How do you pass secrets securely to Docker containers without leaking them in image history?
Never use `ENV` in a Dockerfile for sensitive passwords, because `docker history` exposes all `ENV` values in plain text. Instead:
1. Pass secrets at runtime via `--env-file` or environment variables injected by the orchestration platform (AWS ECS, Kubernetes).
2. Use Docker Compose `secrets:` (which mounts the secret into a tmpfs in-memory file at `/run/secrets/`).
3. Fetch secrets dynamically from AWS Secrets Manager or HashiCorp Vault during app bootstrap.

### 17. What is Docker BuildKit and why should you use it?
BuildKit is Docker's modern build engine (enabled by default in modern Docker). It offers:
- Parallel stage execution in multi-stage builds.
- Skipping unused build stages.
- Cache mounts: `RUN --mount=type=cache,target=/root/.npm` to cache package downloads across builds without baking them into the final image.
- Secret mounts: `RUN --mount=type=secret,id=mysecret` to use credentials during build time without baking them into image layers.

### 18. When should an organization migrate from Docker Compose to Kubernetes?
Docker Compose is optimal for local development and single-server deployments (e.g. an EC2 instance). Migrate to Kubernetes (K8s) when you need:
- Multi-node clustering across dozens or hundreds of servers.
- Automated horizontal pod autoscaling (HPA) based on CPU/traffic spikes.
- Automated self-healing (re-scheduling dead containers on healthy nodes).
- Advanced traffic splitting, canary rollouts, and multi-cloud resilience.

### 19. How do you debug a container that exits immediately upon startup?
1. Inspect exit code: `docker ps -a` (check if Exit Code is 0, 1, 127, or 137).
2. Read startup logs: `docker logs <container_name>`.
3. Override entrypoint to inspect the filesystem interactively:
   ```bash
   docker run --rm -it --entrypoint sh <image_name>
   ```

### 20. What is a "Distroless" container image and why is it used?
Distroless images (created by Google) contain **only** your application and its direct runtime dependencies. They do not contain package managers (`apt`, `apk`), shells (`bash`, `sh`), or standard Linux utilities (`curl`, `ls`).
- **Advantage**: Massively reduces CVE attack surface; an attacker who finds an injection vulnerability cannot open a shell, download curl scripts, or run Linux commands.

### 21. How do you prevent Docker container logs from filling up server disk space?
By default, Docker's `json-file` log driver logs indefinitely to disk. Prevent disk exhaustion by configuring log rotation in `docker-compose.yml` or `/etc/docker/daemon.json`:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```
This caps total logs per container at 30 MB (3 files x 10 MB).

### 22. How do you authenticate and push images to AWS ECR?
1. Authenticate Docker CLI with AWS temporary token:
   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   ```
2. Tag image with the ECR repository URI:
   ```bash
   docker tag my-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-repo:latest
   ```
3. Push:
   ```bash
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-repo:latest
   ```

### 23. How do you perform a zero-downtime deployment with Docker Compose on a single VM?
1. Run containers behind an Nginx reverse proxy.
2. Use rolling restarts or spin up the new container version on a secondary port (e.g. port 3001), verify its health with `curl`, update Nginx upstream to point to 3001, reload Nginx (`nginx -s reload`), and terminate the old container on port 3000 (Blue/Green deployment).

### 24. What are the security risks of mounting `/var/run/docker.sock` into a container?
The Docker socket is the communication channel to the Docker daemon. Anyone with read/write access to `docker.sock` has equivalent permissions to `root` on the host machine. A container mounting `docker.sock` can launch privileged containers, mount the host's root filesystem (`/`), and completely compromise the host server.

### 25. How do you inspect and optimize the size of an existing Docker image?
1. Run `docker history <image>` to see the exact size contribution of each layer.
2. Use third-party CLI tools like `dive` (`dive <image>`) to visually explore layer contents and wasted space.
3. Optimize by:
   - Combining `RUN` statements (`apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*`).
   - Using `.dockerignore`.
   - Adopting multi-stage builds.
   - Switching to Alpine or Slim base images.
