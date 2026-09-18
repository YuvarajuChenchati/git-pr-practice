# 🏛️ Module 01: Terraform Foundations & The End of ClickOps

> *"If it's not in Git, it doesn't exist.*  
> *If you clicked it in the AWS console, nobody knows how to rebuild it when disaster strikes."*

---

## 😱 The Horror Story: The ClickOps Disaster

It was 2018. An engineer at a high-growth startup needed to launch an API in AWS:
1. He logged into the AWS Web Console.
2. Clicked through VPC Wizard (14 clicks).
3. Created a Subnet (6 clicks).
4. Configured an Internet Gateway and Route Table (12 clicks).
5. Attached a Security Group with custom inbound ports (8 clicks).
6. Launched an EC2 instance (18 clicks).
7. Total time: **3 hours**.

Three months later, an AWS data center region had an outage.
Management ordered: **"Spin up our entire infrastructure in `us-west-2` (Oregon) immediately!"**
- The engineer couldn't remember which subnets he configured.
- He forgot which security group ports he opened.
- The recreation took **2 full days of downtime**. Cost: **$120,000 in lost revenue**.

---

## 🛡️ The Solution: Infrastructure as Code (IaC)

With **Terraform**:
```hcl
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "production-vpc" }
}
```
- Want to deploy in Oregon? Change `region = "us-west-2"` and run `terraform apply`.
- **Entire enterprise cloud infrastructure boots in 3 minutes!**

---

## ⚡ The 4 Commands You Will Run 10,000 Times

| Command | What It Does | Real World Analogy |
|---|---|---|
| **`terraform init`** | Downloads cloud provider plugins (AWS, Azure, Google Cloud). | `npm install` or `pip install` |
| **`terraform plan`** | Shows the exact diff between your code and cloud reality. | `git diff` before committing |
| **`terraform apply`** | Executes the changes by making authenticated cloud API calls. | Committing and deploying |
| **`terraform destroy`** | Deletes every single resource created by your code. | Unsubscribing / shutting down |

---

## 🧪 Real Working Code

Open [`main.tf`](./main.tf) to see a complete AWS VPC, Subnet, and Security Group defined cleanly in HCL!
