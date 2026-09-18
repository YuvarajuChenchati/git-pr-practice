# 🤖 CI/CD & GitOps Mastery: Automated Pipelines & ArgoCD

> *"If a human has to manually SSH into a server, build a Docker image, or run `kubectl apply` from their laptop, your deployment process is broken.*  
> *Production changes must happen through automated, auditable, and self-healing GitOps pipelines."*

Welcome to the **complete, hands-on, storytelling-driven CI/CD & GitOps curriculum**!
This repository provides the automation highway connecting your entire stack:
**Git Commit ➔ Automated Tests ➔ Docker Buildx ➔ Security CVE Scan ➔ AWS ECR ➔ ArgoCD GitOps ➔ Kubernetes Cluster**.

---

## 🌟 Quick Start: Launch the Interactive CI/CD & GitOps Hub!

Experience automated pipelines visually with our **Interactive Pipeline & GitOps Simulator**:
- 🧪 **Live Pipeline Simulator**: Watch visual stages (`[1. Git Push]` ➔ `[2. Test & Lint]` ➔ `[3. Docker Buildx & Trivy]` ➔ `[4. Push to ECR]` ➔ `[5. ArgoCD Sync ➔ K8s]`).
- ⚡ **Click "Simulate Git Push"**: Watch steps execute with real-time logs, progress bars, and image digest hashes.
- 🛑 **Click "Simulate Test Failure"**: See how automated CI stops broken code before it can ever touch production!
- 🕵️ **Click "Simulate Cluster Drift"**: Watch ArgoCD detect unauthorized manual changes in Kubernetes and automatically self-heal back to Git!
- 📖 **Story Mode**: The Friday 5 PM Deployment Disaster, The Push vs Pull Dilemma, and The Declarative GitOps Salvation.
- 🎮 **Disaster Recovery Quiz Arena**: Solve real CI/CD production incidents with memes and architectural breakdowns.
- 💻 **Visual Workflow Generator**: Generate production-ready `.github/workflows/deploy.yml` with toggleable security and build steps.

👉 **Open in Browser**:
```text
file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/interactive-hub/index.html
```
Or open [`cicd-gitops-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/interactive-hub/index.html).

---

## 🗺️ The Complete CI/CD & GitOps Curriculum

| Module | Core Concepts Mastered | Real Working Workflows |
|---|---|---|
| **01** | [**CI Foundations & GitHub Actions**](./01-ci-foundations-github-actions/) | Events & Triggers (`push`, `pull_request`), Runners, Jobs, Matrix builds, GitHub Secrets | [`ci-pipeline.yml`](./01-ci-foundations-github-actions/.github/workflows/ci-pipeline.yml) |
| **02** | [**Automated Docker Builds & Buildx**](./02-automated-docker-builds/) | Docker Buildx, Multi-platform builds (`amd64`/`arm64`), GitHub Actions cache (`type=gha`), Immutable image tagging (`v1.0.0-sha-7a8b9c`) | [`build-and-push.yml`](./02-automated-docker-builds/build-and-push.yml) |
| **03** | [**Security Scanning in CI (DevSecOps)**](./03-security-scanning-in-ci/) | Static Application Security Testing (SAST), Trivy container CVE scanner, Secret scanning in PRs, Quality gates | [`security-scan.yml`](./03-security-scanning-in-ci/security-scan.yml) |
| **04** | [**GitOps & ArgoCD**](./04-gitops-and-argocd/) | Why Push-based CD is a security risk, Pull-based GitOps, ArgoCD Architecture, Application CRD, Auto-Sync & Self-Healing | [`argocd-application.yaml`](./04-gitops-and-argocd/argocd-application.yaml) |
| **05** | [**Troubleshooting & Senior Interview Playbook**](./05-interview-and-troubleshooting-playbook/) | Flaky tests, Leaked AWS keys in CI logs, Out-of-sync loops, Top 20 Senior CI/CD & GitOps Interview Q&A | [`senior-interview-prep.md`](./05-interview-and-troubleshooting-playbook/senior-interview-prep.md) |

---

## 💡 The Core Mental Model: Push-Based CI vs Pull-Based GitOps

```
                            THE MODERN GITOPS HIGHWAY
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
┌───────────────────────────────┐                         ┌───────────────────────────────┐
│     CONTINUOUS INTEGRATION    │                         │      CONTINUOUS DELIVERY      │
│        (GitHub Actions)       │                         │           (ArgoCD)            │
│                               │                         │                               │
│  1. Developer pushes code     │                         │  1. ArgoCD agent inside K8s   │
│  2. Run unit tests & linters  │                         │     watches Git repo 24/7     │
│  3. Run Trivy vulnerability   │                         │  2. Detects new image SHA     │
│  4. Build Docker image        │                         │  3. Automatically reconciles  │
│  5. Push image to Amazon ECR  │                         │     and updates pods!         │
│  6. Update manifest repo Git  │                         │  4. Self-heals manual drift!  │
└──────────────┬────────────────┘                         └───────────────▲───────────────┘
               │                                                          │
               ▼                                                          │
   [ Image in Amazon ECR ] ───────────────────────────────────────────────┘
```
