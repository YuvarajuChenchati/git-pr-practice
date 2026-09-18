# Lab 01: Docker Compose Healthchecks & Startup Order

### The #1 Trap with `depends_on`:
In basic Docker Compose, if you write:
```yaml
services:
  api:
    depends_on:
      - db
```
Docker **ONLY** waits for the `db` container to *start*.
However, MySQL takes 10 to 15 seconds to create internal system tables, listen on port 3306, and accept connections!
Your `api` starts immediately, tries to connect to MySQL in second 1, crashes with `ECONNREFUSED`, and exits!

---

### The Solution: `healthcheck` + `condition: service_healthy`

In modern Compose, you configure a healthcheck on the database:
```yaml
services:
  db:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_secret"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    depends_on:
      db:
        condition: service_healthy
```
Now Docker Compose will keep `api` in a waiting state until `mysqladmin ping` returns exit code 0!
Your API will **never crash on startup** again!
