# 🛡️ Module 03: Security Scanning in CI (DevSecOps)

> *"Shift-Left Security: Finding a vulnerability in a Pull Request costs $50.*  
> *Finding it after a data breach in production costs $5,000,000 and your company's reputation."*

---

## 🔍 The 3 Security Pillars in Automated CI

1. **Secret Scanning (TruffleHog / GitGuardian)**:
   - Scans every line of code in the PR for accidentally committed AWS secret keys, Stripe tokens, or private RSA keys.
2. **Container CVE Scanning (Aqua Security Trivy)**:
   - Scans your Docker image OS packages (`alpine`, `debian`) and application libraries (`node_modules`, `requirements.txt`).
   - Flags known Common Vulnerabilities and Exposures (CVEs).
3. **Quality Gates (The Circuit Breaker)**:
   - If Trivy detects a `CRITICAL` vulnerability (e.g. Remote Code Execution), **THE PIPELINE FAILS**. The image is never pushed to production!

---

## 🧪 Real Working Workflow
Open [`security-scan.yml`](./security-scan.yml) to see how Aqua Trivy integrates into GitHub Actions with SARIF report output!
