# 🔐 Docker Secrets & Configuration Management

## ⚠️ The Critical Security Mistake: Leaking Secrets in Images

Many beginners write this in their `Dockerfile`:
```dockerfile
# ❌ NEVER DO THIS!
ENV DB_PASSWORD="SuperSecretPassword123!"
```
### Why is this dangerous?
Even if you delete the line later or overwrite it, **anyone who has access to the Docker image can run**:
```powershell
docker history --no-trunc my-image
```
And see your plain-text database password in the image history!

---

## 🛡️ The 3 Correct Ways to Handle Secrets

### Method 1: Environment Variables at Runtime
Never bake secrets into the image. Inject them when starting the container:
```powershell
docker run -d `
  -e DB_PASSWORD="SuperSecretPassword123!" `
  --name app my-image
```
Or via an uncommitted `.env` file (ensure `.env` is in `.gitignore`):
```powershell
docker run -d --env-file .env.production --name app my-image
```

---

### Method 2: Docker Compose Secrets (Production Standard)
In Docker Compose, use file-based secrets:

```yaml
services:
  api:
    image: my-api:v1
    secrets:
      - db_password
    environment:
      # Application reads the password from /run/secrets/db_password
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```
Docker mounts the secret directly into memory (`/run/secrets/`) as a file, so it is **never written to disk or baked into images**!

---

### Method 3: Cloud Secrets (AWS Secrets Manager / SSM)
On AWS EC2 / ECS:
1. Store secrets in **AWS Secrets Manager**.
2. Give the EC2 IAM Role `secretsmanager:GetSecretValue`.
3. In your Node/Python app, fetch secrets via the AWS SDK at container startup.
