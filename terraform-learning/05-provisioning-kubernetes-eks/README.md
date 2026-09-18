# ☸️ Module 05: Provisioning AWS EKS Kubernetes with Terraform

> *"This is where everything converges.*  
> *Terraform writes the cloud infrastructure that runs Kubernetes,*  
> *which orchestrates the Docker containers."*

---

## 🏗️ The Cloud Architecture for Kubernetes

You cannot simply launch an EKS cluster in a flat network. Production Kubernetes requires a **strict dual-tier network architecture**:

```
                                [ THE INTERNET ]
                                        │
                                        ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           AWS VPC (10.0.0.0/16)                             │
  │                                                                             │
  │   PUBLIC SUBNETS (10.0.1.0/24 & 10.0.2.0/24)                                │
  │   - Internet Gateway attached                                               │
  │   - AWS Application Load Balancers (ALB / Ingress Controller) live here!    │
  │   - NAT Gateways (allow private subnets to pull Docker images safely)       │
  │                                                                             │
  │   PRIVATE SUBNETS (10.0.10.0/24 & 10.0.20.0/24)                             │
  │   - NO direct internet access (Zero public IPs for security!)               │
  │   - AWS EKS Managed Worker Nodes (EC2 `t3.medium`) live here!               │
  │   - Pods, Microservices, and Databases run safely behind NAT Gateway        │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Real HCL Code in this Module
- [`vpc-for-eks.tf`](./vpc-for-eks.tf): Dedicated VPC, subnets with Kubernetes tags (`kubernetes.io/role/elb = 1`), and NAT Gateway.
- [`eks-cluster.tf`](./eks-cluster.tf): AWS EKS Cluster Control Plane + IAM Roles + Managed Node Group (auto-scaling from 2 to 6 nodes).
