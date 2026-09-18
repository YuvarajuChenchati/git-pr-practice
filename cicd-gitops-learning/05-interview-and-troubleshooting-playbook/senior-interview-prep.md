# 🎯 Top 20 Senior CI/CD & GitOps Interview Q&A

### Q1: What is the difference between Continuous Integration (CI), Continuous Delivery (CD), and Continuous Deployment?
**Answer**:
- **Continuous Integration (CI)**: Automates the merging, building, linting, and testing of code on every commit to ensure errors are caught immediately.
- **Continuous Delivery (CD)**: Automatically builds deployable artifacts (Docker images, Helm charts) and deploys them to staging environments; production deployment is automated but requires a manual human approval button.
- **Continuous Deployment**: Every commit that passes the automated pipeline is deployed directly into production with **zero human intervention**.

---

### Q2: Why is Pull-Based GitOps (ArgoCD) preferred over Push-Based CI/CD (GitHub Actions) for Kubernetes?
**Answer**:
1. **Security & Zero-Trust**: In push-based CD, you must store administrative `kubeconfig` credentials inside GitHub Secrets, giving the CI runner write access across the internet. In pull-based GitOps, the ArgoCD agent lives **inside** the Kubernetes cluster and pulls manifests via HTTPS. No cluster credentials ever leave the firewall.
2. **Drift Detection & Self-Healing**: Push-based tools only run on git push. If someone manually changes a pod or service with `kubectl` at 2 AM, push-based CI has no idea. ArgoCD continuously reconciles cluster state against Git and automatically reverts unauthorized manual edits!

---

### Q3: How do you eliminate long-lived AWS IAM Access Keys from GitHub Actions?
**Answer**:
Using **AWS OpenID Connect (OIDC)**:
1. Configure an OIDC Identity Provider in AWS IAM trusting `token.actions.githubusercontent.com`.
2. Create an IAM Role with an `AssumeRoleWithWebIdentity` trust policy matching the specific GitHub repository and branch (`repo:my-org/my-repo:ref:refs/heads/main`).
3. In GitHub Actions, use `aws-actions/configure-aws-credentials` with `role-to-assume`.
4. GitHub generates a short-lived, cryptographically signed JSON Web Token (JWT), which AWS exchanges for temporary 15-minute STS credentials. **Zero permanent keys stored in GitHub!**

---

### Q4: How does ArgoCD handle Helm charts and Kustomize overlays?
**Answer**:
ArgoCD has native first-class support for Helm and Kustomize:
- **Helm**: ArgoCD can track a Helm chart repository or Git folder containing `Chart.yaml` and pass custom `values.yaml` for Dev, Staging, and Prod.
- **Kustomize**: ArgoCD can render Kustomize bases and overlays (`environments/prod/kustomization.yaml`), applying patches (e.g. image tag updates, replica counts) without templating overhead.

---

### Q5: What is a Canary Deployment, and how is it implemented in Kubernetes?
**Answer**:
A **Canary Deployment** routes a tiny percentage of real user traffic (e.g. 5%) to a new version (`v2`) while keeping 95% on the stable version (`v1`).
- Metrics (HTTP 5xx errors, latency) are analyzed via Prometheus.
- If error rates remain normal, traffic is progressively increased (10%, 25%, 50%, 100%).
- If errors spike, it automatically rolls back immediately.
*Tools*: **Argo Rollouts** or **Flagger** integrated with Istio / Nginx Ingress Service Meshes.

---

### Q6: How do you achieve fast Docker builds in CI without downloading npm packages on every run?
**Answer**:
Using **Docker Buildx with GitHub Actions Cache**:
```yaml
uses: docker/build-push-action@v5
with:
  cache-from: type=gha
  cache-to: type=gha,mode=max
```
This persists the BuildKit cache directly into GitHub Actions cache storage. Rebuilds take seconds because cached `node_modules` and compiled layers are reused across workflow runs.

---

### Q7: What is the difference between Blue/Green Deployment and Rolling Update?
**Answer**:
- **Rolling Update**: Pods are replaced one by one within the same deployment. Resource-efficient, but during the rollout both `v1` and `v2` pods coexist, requiring backward-compatible database schemas.
- **Blue/Green Deployment**: Two identical environments exist side-by-side: Blue (Live v1) and Green (Idle v2). You deploy `v2` to Green, run smoke tests, and flip the Router/Load Balancer switch instantly. Rollback is equally instant (flip traffic back to Blue). Requires 2x server capacity during deployment.

---

### Q8: What does the `ignoreDifferences` field in an ArgoCD Application manifest do?
**Answer**:
It prevents ArgoCD from reporting an "OutOfSync" status when specific fields are mutated dynamically at runtime by Kubernetes controllers.
*Classic Example*: If a **HorizontalPodAutoscaler (HPA)** scales replicas from 3 to 10 based on CPU load, Git still declares `replicas: 3`. Setting `ignoreDifferences` on `spec.replicas` allows HPA to scale without ArgoCD fighting it and forcing it back down to 3!

---

### Q9: How do you handle database schema migrations in a zero-downtime CI/CD pipeline?
**Answer**:
Follow the **Expand and Contract (Parallel Run) Pattern**:
1. **Expand**: Apply a backward-compatible database migration (e.g. add a new column `full_name`, but keep existing `first_name` and `last_name`). Old code continues to work seamlessly.
2. **Deploy Code**: Deploy the new application version that reads and writes to the new column.
3. **Contract**: Once all pods are running the new version and old code is retired, run a cleanup migration to drop the obsolete columns.
Migrations are executed as **Kubernetes Jobs** or **ArgoCD PreSync hooks** before the new pods roll out.

---

### Q10: What is a "Self-Hosted Runner", and when would you use one?
**Answer**:
A machine (AWS EC2, on-prem bare-metal server, or Kubernetes Pod via Actions Runner Controller - ARC) that you manage yourself to run GitHub Actions jobs.
*Use Cases*:
- Jobs requiring access to private internal VPC resources (private RDS, internal VPN).
- Heavy workloads requiring 64 CPU cores, 256GB RAM, or GPUs for AI/ML builds.
- Drastically reducing GitHub Actions billing costs on high-frequency enterprise build pipelines.
