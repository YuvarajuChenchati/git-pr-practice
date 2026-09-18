# 🏗️ Terraform (IaC) Mastery: From ClickOps to Cloud Automation

> *"If you are clicking buttons in the AWS Web Console to deploy infrastructure, you are not doing DevOps. You are doing ClickOps.*  
> *Everything in the modern cloud must be written in code."*

Welcome to the **complete, hands-on, storytelling-driven Terraform curriculum**!
This repository bridges the final piece of the DevOps trinity:
**Docker (Containerize App) ➔ Kubernetes (Orchestrate Fleets) ➔ Terraform (Provision the Cloud Infrastructure).**

---

## 🌟 Quick Start: Launch the Interactive Terraform Hub & Simulator!

Experience Terraform workflows visually with our **Interactive Cloud Canvas Lab**:
- 🧪 **Live Cloud Canvas & Lifecycle Simulator**: Visual AWS VPC, Subnets, EC2 instances, and S3 buckets.
- ⚡ **Simulate `terraform plan` & `terraform apply`**: Watch resources transition through `+ create`, `~ update in-place`, and `- destroy` with real HCL diffs.
- 🕵️ **Drift Detection Simulator**: Intentionally change a cloud resource, run `terraform plan`, and watch Terraform detect the drift and correct it!
- 📖 **Story Mode**: The ClickOps Tragedy ($12k surprise bill), The Holy Trinity (`init`, `plan`, `apply`), The State File Nightmare, and State Locking with DynamoDB.
- 🎮 **Disaster Recovery Quiz Arena**: Solve real IaC incidents with memes and architectural explanations.
- 💻 **Visual HCL Code Generator**: Generate production-ready Terraform code with toggleable flags.

👉 **Open in Browser**:
```text
file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/interactive-hub/index.html
```
Or open [`terraform-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/interactive-hub/index.html).

---

## 🗺️ The Complete Terraform Curriculum

| Module | Core Concepts Mastered | Real Working HCL Code |
|---|---|---|
| **01** | [**Foundations & Core Workflow**](./01-terraform-foundations/) | Declarative vs Imperative, Providers (AWS/GCP/Azure), The Holy Trinity (`init`, `plan`, `apply`, `destroy`), Resource blocks | [`main.tf`](./01-terraform-foundations/main.tf) |
| **02** | [**Variables, Types & Outputs**](./02-variables-and-outputs/) | Parameterizing infrastructure, `variables.tf`, `terraform.tfvars`, type validation, locals, sensitive data | [`variables.tf`](./02-variables-and-outputs/variables.tf)<br>[`outputs.tf`](./02-variables-and-outputs/outputs.tf) |
| **03** | [**State Management & Backends**](./03-state-management-and-backends/) | The Holy State File (`terraform.tfstate`), S3 Remote Backend, DynamoDB Distributed State Locking, Drift detection, `terraform import` | [`backend-s3.tf`](./03-state-management-and-backends/backend-s3.tf) |
| **04** | [**Modules & Code Reuse (DRY)**](./04-modules-and-code-reuse/) | Reusable architectural building blocks, input parameters, promoting code across Dev, Staging, and Production | [`modules/vpc/main.tf`](./04-modules-and-code-reuse/modules/vpc/main.tf) |
| **05** | [**Provisioning AWS EKS Kubernetes**](./05-provisioning-kubernetes-eks/) | Complete real production blueprint: VPC, Public/Private Subnets, NAT Gateways, EKS Cluster, Managed Node Groups | [`eks-cluster.tf`](./05-provisioning-kubernetes-eks/eks-cluster.tf)<br>[`vpc-for-eks.tf`](./05-provisioning-kubernetes-eks/vpc-for-eks.tf) |
| **06** | [**Interview & Security Playbook**](./06-interview-and-security-playbook/) | Security scanning (`tfsec`, `checkov`), Immutable vs Mutable infrastructure, Top 20 Senior Terraform Interview Q&A | [`senior-interview-prep.md`](./06-interview-and-security-playbook/senior-interview-prep.md) |

---

## 💡 The Core Mental Model of Terraform

### The Terraform Execution Loop
```
[ Your HCL Code (.tf) ]          [ Real World Cloud (AWS) ]
           │                                 │
           └──────────────┬──────────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │ terraform.tfstate (State) │
            └─────────────┬─────────────┘
                          │
         terraform plan   ▼   terraform apply
   "Here is what needs to change" ➔ "Make it happen via Cloud API"
```

1. **`terraform init`**: Downloads the required cloud provider plugins (e.g. AWS Provider v5.x).
2. **`terraform plan`**: Compares your desired `.tf` files against the current `terraform.tfstate` and actual cloud state. Generates an execution diff:
   - `+` Create new resource
   - `~` Modify existing resource in-place
   - `-` Destroy resource
   - `- / +` Destroy and re-create (Dangerous for databases!)
3. **`terraform apply`**: Makes HTTPS REST API calls to AWS/GCP to bring reality in sync with your code.
4. **`terraform destroy`**: Tears down all provisioned resources so you don't get charged on weekends!
