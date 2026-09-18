# ☁️ Project 04: Complete AWS EC2 Docker Deployment Guide

This guide walks you through deploying your containerized application to **AWS EC2** with production best practices: private ECR pull, IAM Role authentication, Nginx reverse proxy, and Let's Encrypt SSL.

---

## 📋 Architecture Overview

```
+-------------------------------------------------------------+
|                      AWS EC2 INSTANCE                       |
|                                                             |
|   Port 80 (HTTP)  --> [Nginx] --> Redirect to HTTPS (443)   |
|   Port 443 (HTTPS) -> [Nginx]                               |
|                         | (SSL Terminated)                  |
|                         v                                   |
|               http://api:3000 (Internal)                    |
|                         |                                   |
|               [Container: Production API]                   |
|                         |                                   |
|   [Let's Encrypt Certbot] (Auto-renews SSL every 60 days)   |
+-------------------------------------------------------------+
```

---

## Step 1: Launch an AWS EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/ec2).
2. Click **Launch Instance**:
   - **Name**: `docker-production-server`
   - **AMI**: Ubuntu Server 24.04 LTS (64-bit x86)
   - **Instance Type**: `t2.micro` or `t3.micro` (Free Tier eligible)
   - **Key Pair**: Create new key pair (e.g. `docker-key.pem`) and download it.
3. **Network Settings (Security Group)**:
   Ensure these inbound rules are allowed:
   | Type | Port | Source | Purpose |
   |---|---|---|---|
   | **SSH** | 22 | My IP (or `0.0.0.0/0`) | Remote SSH access |
   | **HTTP** | 80 | `0.0.0.0/0` | Let's Encrypt challenge & HTTP traffic |
   | **HTTPS** | 443 | `0.0.0.0/0` | Secure web traffic |
4. Click **Launch Instance**.

---

## Step 2: Attach IAM Role to EC2 (Secure Cloud Authentication)

> [!CAUTION]
> **NEVER** run `aws configure` on your EC2 server with hardcoded access keys!
> If someone breaches your server, they gain your AWS credentials.
> Instead, attach an **IAM Role** with `AmazonEC2ContainerRegistryReadOnly` policy!

1. Go to AWS **IAM** ➔ **Roles** ➔ **Create Role**.
2. Select **Trusted entity type**: AWS Service ➔ **EC2**.
3. Add permissions policy: `AmazonEC2ContainerRegistryReadOnly`.
4. Name the role: `EC2-ECR-PullRole`.
5. Go back to your EC2 instance list, right click your instance ➔ **Security** ➔ **Modify IAM Role** ➔ Select `EC2-ECR-PullRole` ➔ Save.

---

## Step 3: Connect to EC2 & Install Docker

From your local machine (PowerShell or Bash):
```bash
# Set key permission (if on Mac/Linux) or run in PowerShell
ssh -i "path/to/docker-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

Once connected inside the EC2 Ubuntu terminal, install Docker:
```bash
# Update package lists
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key & repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow running docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## Step 4: Authenticate with ECR on the EC2 Instance

Because we attached the IAM role in Step 2, authenticate with a single command:
```bash
# Replace YOUR_AWS_REGION and YOUR_ACCOUNT_ID with yours:
AWS_REGION="ap-south-1"
ACCOUNT_ID="123456789012"

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

---

## Step 5: Deploy the Production Stack

Create your deployment directory on EC2:
```bash
mkdir -p ~/app/nginx
cd ~/app
```
Copy `docker-compose.prod.yml`, `nginx/default.conf`, and `deploy.sh` into `~/app`.

Run the automated deployment:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Step 6: Verify Your Production API
Check running containers:
```bash
docker compose -f docker-compose.prod.yml ps
```

Visit in your browser:
👉 `http://<YOUR_EC2_PUBLIC_IP>` or `http://yourdomain.com`

You are live on AWS! 🚀
