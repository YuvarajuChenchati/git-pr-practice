# 🎛️ Module 02: Variables, Outputs & Parameterization

> *"Hardcoding values into Terraform code is like writing software with global constants.*  
> *Parameterize everything so the exact same code can spin up Dev, Staging, and Production."*

---

## 🗂️ The Holy Trinity of HCL Files

| File | Purpose | Analogy |
|---|---|---|
| **`variables.tf`** | Declares the expected input parameters, types, and default values. | Function Arguments / Interface |
| **`terraform.tfvars`** | Supplies the actual values for a specific environment (Dev vs Prod). | Function Call Arguments |
| **`outputs.tf`** | Exposes values (like Public IP, DB endpoints, VPC IDs) to terminal or other stacks. | Return Statement |

---

## 🔒 Sensitive Variables
If an input is a database password or API token:
```hcl
variable "db_password" {
  type        = string
  description = "Database administrator password"
  sensitive   = true # Prevents printing password in logs & terminal output!
}
```

---

## 🧪 Real Code in this Module
- [`variables.tf`](./variables.tf): Variable declarations with type constraints.
- [`terraform.tfvars`](./terraform.tfvars): Environment variable values.
- [`outputs.tf`](./outputs.tf): Exported values.
