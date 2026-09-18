# 🩺 Module 05: Troubleshooting & Senior GitOps Interview Playbook

> *"Any developer can write a GitHub Action that runs `npm test`.*  
> *A Senior DevOps Engineer designs zero-trust, self-healing GitOps delivery pipelines that deploy 50 times a day with zero human intervention."*

---

## 🚨 The 5 Classic CI/CD & GitOps Incidents

| Incident | Root Cause | Solution |
|---|---|---|
| **1. Leaked Secrets in Console Logs** | Developer did `echo "API_KEY=$KEY"` or curl with plaintext header in a bash step. | Use GitHub Secrets masking (`::add-mask::`), integrate with HashiCorp Vault or AWS OIDC authentication (IAM Roles for GitHub Actions). |
| **2. Slow 25-Minute Docker Builds in CI** | Runner starts with fresh blank disk; every `npm install` and base image is downloaded from scratch. | Use Buildx caching: `cache-from: type=gha` and `cache-to: type=gha,mode=max` to persist cached layers across workflow runs! |
| **3. ArgoCD Out-of-Sync Loop** | Manifest in Git specifies dynamic mutated field (e.g. replica count modified by HPA, or timestamp annotation). | Configure `ignoreDifferences` in the ArgoCD Application spec for fields managed dynamically by K8s controllers. |
| **4. Flaky Test Blocking Hotfix** | An end-to-end test times out due to third-party network latency, blocking an urgent bugfix. | Isolate fast unit/integration tests from slow E2E tests; implement test retry action with alert monitoring. |
| **5. CI Runner Out of Disk Space** | Multiple Docker images and dangling build caches accumulate on self-hosted GitHub Actions runner. | Add a post-build step running `docker image prune -af` or use ephemeral container runners that self-destruct after each job. |

---

## 📚 Guides in this Module
- [`senior-interview-prep.md`](./senior-interview-prep.md): Top 20 Senior CI/CD & GitOps Interview Q&As covering OpenID Connect (OIDC), canary deployments, ArgoCD architecture, and multi-branch workflows.
