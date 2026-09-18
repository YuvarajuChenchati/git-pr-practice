# 🎯 Top 20 Senior Terraform & IaC Interview Q&A

### Q1: What is the core difference between Terraform and Ansible?
**Answer**:
- **Terraform** is primarily an **Infrastructure Provisioning tool** (declarative orchestration). It excels at provisioning cloud foundation resources (VPCs, Subnets, EKS clusters, IAM roles, S3 buckets, RDS databases).
- **Ansible** is primarily a **Configuration Management tool** (imperative/procedural execution). It excels at configuring software inside already-running virtual machines (installing packages, configuring nginx configs, creating Linux users).
*Industry best practice*: Use Terraform to build the cloud servers, and use Ansible or Docker/Kubernetes to configure the software running inside them.

---

### Q2: What is "State Drift", and how does Terraform handle it?
**Answer**:
State Drift occurs when a cloud resource is modified **outside** of Terraform (e.g. an engineer logs into the AWS Web Console and manually edits a Security Group port or deletes an EC2 instance).
When you run `terraform plan`:
1. Terraform queries the actual AWS API to refresh its memory of real-world infrastructure.
2. Compares real-world state against `terraform.tfstate` and your desired code in `.tf`.
3. Detects the drift and calculates the exact diff to bring reality back into alignment with your code. Running `terraform apply` overwrites the manual drift!

---

### Q3: Why does Terraform use a DAG (Directed Acyclic Graph)?
**Answer**:
Terraform builds a dependency graph of all resources to determine:
1. **Creation Order**: If a Subnet requires `aws_vpc.main.id`, Terraform knows the VPC must be created first.
2. **Maximum Parallelism**: Independent resources (e.g. S3 bucket A and Security Group B) are provisioned concurrently (default 10 parallel threads) to minimize apply time.
If resource A depends on B and B depends on A, Terraform throws a **Cycle Error**.

---

### Q4: What happens if `terraform apply` crashes or is interrupted midway?
**Answer**:
Terraform writes to state incrementally. Any resources created before the crash are recorded in `terraform.tfstate`.
When you run `terraform apply` again, Terraform checks the state, sees the partially provisioned resources, and continues from where it left off.
If a resource was left in a corrupted or half-baked state, you use `terraform apply -replace="aws_instance.web"` to cleanly recreate only that damaged resource.

---

### Q5: How do you import pre-existing cloud resources into Terraform without deleting them?
**Answer**:
1. Write the resource block in your `.tf` code matching the existing resource:
   ```hcl
   resource "aws_s3_bucket" "legacy_bucket" {
     bucket = "my-legacy-unmanaged-bucket"
   }
   ```
2. Run `terraform import`:
   ```bash
   terraform import aws_s3_bucket.legacy_bucket my-legacy-unmanaged-bucket
   ```
3. Terraform reads the bucket from AWS and writes its metadata into `terraform.tfstate`. It is now fully managed by code!
*(In Terraform 1.5+, you can also use declarative `import {}` blocks directly in HCL).*

---

### Q6: What is the purpose of DynamoDB in the AWS S3 backend?
**Answer**:
Amazon S3 does not natively provide mutual exclusion or atomic locking for file writes.
If two engineers (or two automated GitHub Action runners) run `terraform apply` concurrently, they would overwrite each other's state file, causing severe state corruption.
Terraform uses a DynamoDB table with a primary key `LockID`:
- The first apply acquires the lock.
- Any subsequent attempt receives `Error: Error acquiring the state lock` and exits immediately until the first apply finishes.

---

### Q7: Explain the difference between `count` and `for_each`.
**Answer**:
- **`count`**: Creates instances indexed by integer (`[0]`, `[1]`, `[2]`). If you delete an item from the middle of a list, all subsequent resources are shifted in index, causing Terraform to unnecessarily destroy and recreate resources!
- **`for_each`**: Creates instances keyed by unique map or set strings (`["web"]`, `["api"]`). Removing one item only destroys that specific key, leaving all other resources completely untouched. *Always prefer `for_each` for production resources!*

---

### Q8: What does the `lifecycle { prevent_destroy = true }` block do?
**Answer**:
It acts as a safety shield. If anyone runs `terraform destroy` or makes a code change that forces resource recreation (e.g. renaming an RDS database identifier), Terraform will immediately throw a fatal error and refuse to execute, preventing catastrophic accidental data loss.

---

### Q9: What is the difference between Local Values (`locals`) and Input Variables?
**Answer**:
- **Input Variables (`var.xxx`)**: Can be customized by the caller or environment (`terraform.tfvars`). They are external inputs.
- **Local Values (`local.xxx`)**: Internal constants or computed expressions (e.g. string interpolations, merged tags) that are scoped strictly inside the module and cannot be overridden externally.

---

### Q10: How do you manage secrets safely in Terraform?
**Answer**:
1. Mark variables as `sensitive = true` so values are masked in console output and logs.
2. Integrate with external secret management vaults:
   - AWS Secrets Manager / Parameter Store (`data "aws_secretsmanager_secret_version"`).
   - HashiCorp Vault provider.
3. Encrypt the remote state backend in S3 using KMS Customer Managed Keys.
4. Run pre-commit hooks with `git-secrets` or `trufflehog` to block hardcoded credentials from ever being committed.
