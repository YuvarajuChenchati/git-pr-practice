# 🧱 Module 04: Modules & Code Reuse (The DRY Principle)

> *"Copy-pasting 500 lines of Terraform code across 3 environments is technical bankruptcy.*  
> *Package your architecture into reusable Modules."*

---

## 🏗️ What is a Terraform Module?

A **Module** is just a container for multiple resources that are used together.
Think of a module like a **Function or Class** in programming:
- **Module Inputs (`variables.tf`)**: Arguments passed to the function.
- **Module Resources (`main.tf`)**: The logic executed inside the function.
- **Module Outputs (`outputs.tf`)**: Return values exported to the caller.

---

## 🧪 Calling the Module in `main.tf`

```hcl
module "dev_vpc" {
  source      = "./modules/vpc"
  vpc_name    = "dev-vpc"
  cidr_block  = "10.0.0.0/16"
  environment = "development"
}

module "prod_vpc" {
  source      = "./modules/vpc"
  vpc_name    = "prod-vpc"
  cidr_block  = "10.100.0.0/16"
  environment = "production"
}
```
With 15 lines of code, you have provisioned two completely isolated, enterprise VPCs!
