# Module 05: Docker in Production & AWS Cloud Deployment

## 🎯 What You Will Master
1. **Container Registries**: How to tag, version, and store images in Docker Hub and **AWS Elastic Container Registry (ECR)**.
2. **AWS Deployment Architectures**:
   - **EC2 with Docker & Compose**: Best for cost-efficiency, full control, and standard production backends.
   - **AWS ECS (Elastic Container Service) & Fargate**: Serverless container orchestration.
   - **AWS EKS**: Managed Kubernetes for enterprise scale.
3. **IAM Roles & Cloud Security**: Why you must use EC2 Instance Profiles instead of hardcoding AWS access keys inside containers.
4. **Nginx Reverse Proxy & SSL (HTTPS)**: Setting up Let's Encrypt Certbot for automatic SSL certificates.
5. **CI/CD Automation**: Automated GitHub Actions pipeline to build images, push to ECR, and trigger automated deployment.

---

## ☁️ The AWS Production Deployment Flow

```
+------------------+         +------------------+         +-----------------------+
|  Developer PC    |         |   AWS ECR        |         |      AWS EC2          |
|  (Your Machine)  |         | (Private Image   |         | (Production Server)   |
|                  |         |    Registry)     |         |                       |
| 1. Build Image   |         |                  |         | 4. Pull Latest Image  |
| 2. Tag with ECR  |  PUSH   |                  |  PULL   | 5. docker compose up  |
|    URL           |=======> |  [app:v1.2.0]    |=======> | 6. Nginx + SSL        |
| 3. Authenticate  |         |                  |         |    terminates HTTPS   |
+------------------+         +------------------+         +-----------+-----------+
                                                                      |
                                                              Port 443 (HTTPS)
                                                                      |
                                                              [Public Internet]
```

---

## 📚 Labs & Materials in this Module
- [Lab 1: Tagging & Pushing to Docker Hub](./labs/01-docker-hub-push.md)
- [Lab 2: AWS ECR Setup & Image Pushing](./labs/02-aws-ecr-setup.md)
- [Project 4: Complete AWS EC2 Production Deployment](./project-04-aws-ec2-deployment/)
