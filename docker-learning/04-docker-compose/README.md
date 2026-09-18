# Module 04: Docker Compose (Multi-Container Orchestration)

## 🎯 What You Will Master
1. **The Declarative Mindset**: Replacing 10+ manual CLI commands with a single `docker compose up -d`.
2. **Key Compose Directives**:
   - `services`: Defining each application container.
   - `build`: Path to Dockerfile or build context.
   - `ports`: Host-to-container port mapping.
   - `environment` / `env_file`: Managing configuration and credentials cleanly.
   - `volumes`: Named persistent volumes and host bind-mounts.
   - `depends_on` with `condition: service_healthy`: Ensuring databases finish initializing before your web app connects!
   - `healthcheck`: Probing container readiness.
   - `networks`: Isolating backend services from public access.

---

## 🏗️ Compose Architecture Diagram

```
                       [Browser / Client]
                                |
                   http://localhost:8080 (Frontend)
                                |
               +----------------v----------------+
               |  frontend-ui (Nginx / React)    |
               +----------------+----------------+
                                | Internal Network: app-net
                   http://backend-api:3000
                                |
               +----------------v----------------+
               |   backend-api (Node Express)    |
               +--------+---------------+--------+
                        |               |
         redis://cache:6379             mysql://db:3306
                        |               |
             +----------v---+     +-----v----------+
             |    cache     |     |       db       |
             |   (Redis)    |     |    (MySQL)     |
             +--------------+     +--------+-------+
                                           |
                                [mysql_data volume]
```

---

## ⚡ Core Docker Compose Commands

```bash
docker compose up -d                 # Start all services in the background
docker compose ps                    # View status of all stack services & health
docker compose logs -f backend-api   # Stream logs for a specific service
docker compose exec backend-api sh   # Open shell inside specific service
docker compose down                  # Stop and remove containers and networks
docker compose down -v               # Stop and ALSO wipe persistent volumes (clean reset)
```

---

## 📚 Labs in this Module
- **[Lab 1: Compose Deep Dive & Healthchecks](./labs/01-compose-deep-dive.md)**
- **[Lab 2: 3-Tier Enterprise Deep Dive (Nginx/Node/Redis/MySQL & Crazy-Level Commands)](./labs/02-three-tier-architecture-deep-dive.md)**
- **[Project 3: Full-Stack eCommerce Environment](./project-03-fullstack-ecommerce/)**
