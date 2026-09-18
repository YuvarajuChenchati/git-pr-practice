# 🛡️ Module 06: Security Scanning & Senior Interview Playbook

> *"Security is not a final step before production. It is baked into your pull requests."*

---

## 🔍 The 3 Security Scanners Every DevOps Engineer Uses

1. **`tfsec` / `trivy`**:
   - Scans HCL code before running `terraform apply`.
   - Flags public S3 buckets (`0.0.0.0/0`), missing encryption keys, wide-open security groups (Port 22 SSH open to the world), and unencrypted EBS volumes.
2. **`checkov`**:
   - Multi-cloud security and compliance scanner.
3. **`tflint`**:
   - Static analysis linter checking for deprecated syntax and invalid AWS instance types.

---

## 📚 Guides in this Module
- [`senior-interview-prep.md`](./senior-interview-prep.md): Top 20 Senior Terraform Interview Q&A covering state locks, dependency graphs, drift, taint/replace, and import workflows.
