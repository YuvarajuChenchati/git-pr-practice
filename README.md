# 🚀 Cloud & DevOps Mastery Hub: From Zero to Staff Cloud Architect

Welcome to the **Complete 5-Pillar Production DevOps Learning Hub**. This workspace contains practical code, disaster playbooks, real architecture manifests, and interactive web simulator labs across the entire modern cloud lifecycle:

```
┌─────────────────────────┐     ┌──────────────────────────┐
│     1. DOCKER 🐳        │ ──▶ │    2. KUBERNETES ☸️      │
│  The Standard Brick     │     │   The Smart City Manager │
│  (Containerize the App) │     │  (Orchestrate 500 Pods)  │
└────────────┬────────────┘     └────────────▲─────────────┘
             │                               │ Pulls & Reconciles
             ▼                               │
┌─────────────────────────┐     ┌────────────┴─────────────┐
│    3. TERRAFORM 🏗️       │ ──▶ │ 4. CI/CD & GITOPS 🤖     │
│   The Cloud Architect   │     │   The Automation Highway │
│  (Code the AWS Infra)   │     │ (GitHub Actions + ArgoCD)│
└────────────┬────────────┘     └──────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│             5. OBSERVABILITY, MONITORING & SRE 📊        │
│          The Flight Instruments & Black Box Flight Log    │
│      (Prometheus + Grafana + OpenTelemetry + Alertmanager)│
└──────────────────────────────────────────────────────────┘
```

---

## 🌟 The 5 Interactive Visual Simulators (Open in Your Browser)

Each pillar features its own cyber-aesthetic web simulator with live interactive playgrounds, storytelling episodes, meme arenas, and config builders:

| # | Pillar & Simulator Hub | Direct Browser Link | What You Can Play With |
|---|---|---|---|
| **1** | **🐳 Docker Mastery Hub** | [`docker-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/interactive-hub/index.html) | Live Dockerfile layer cache simulator (1.8GB ➔ 54MB), network DNS sandbox (`127.0.0.11`), volume disaster recovery, meme quiz. |
| **2** | **☸️ Kubernetes Cluster Lab** | [`kubernetes-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/interactive-hub/index.html) | Live 3-node cluster self-healing (click **"Kill Random Pod"** or **"Crash Worker Node 2"** and watch K8s resurrect replacements), rolling updates. |
| **3** | **🏗️ Terraform Cloud Lab** | [`terraform-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/interactive-hub/index.html) | AWS Cloud Canvas (VPC, Subnets, EC2, S3), simulated `terraform plan` diffs, `apply`, **Drift Detection Simulator**, visual HCL generator. |
| **4** | **🤖 CI/CD & GitOps Lab** | [`cicd-gitops-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/interactive-hub/index.html) | Automated pipeline runner (`[Git Push]` ➔ `[Tests]` ➔ `[Trivy Scan]` ➔ `[Docker Buildx]` ➔ `[ArgoCD Sync]`), circuit breaker test failure, ArgoCD drift self-healing. |
| **5** | **📊 Observability & SRE Lab** | [`observability-sre-learning/interactive-hub/index.html`](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/interactive-hub/index.html) | Live cluster telemetry dashboard (RPS, Latency, Error Rate, Memory, Alert State), traffic spike simulator (10k RPS), memory leak generator, Gateway 502 outage & Alertmanager firing banner, OpenTelemetry distributed trace waterfall, and PromQL query builder. |

---

## 📁 Repository Structure & Modules

### 1. 🐳 [Docker Learning Hub](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/README.md)
*From container fundamentals to multi-stage microservices and kernel internals.*
- [01-docker-fundamentals](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/01-docker-fundamentals/README.md): Linux namespaces, cgroups, OverlayFS copy-on-write, Diagnostic API with web dashboard.
- [02-dockerfile-image-mastery](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/02-dockerfile-image-mastery/README.md): Multi-stage builds slashing size by **97%**, PID 1 zombie reaping (`tini`).
- [03-networking-and-storage](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/03-networking-and-storage/README.md): Named Volumes vs Bind Mounts, Docker embedded DNS (`127.0.0.11`).
- [04-docker-compose-stacks](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/04-docker-compose-stacks/README.md): Full 4-tier microservice (Nginx + Express + MySQL + Redis).
- [05-docker-in-production-disaster-playbooks](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/05-docker-in-production-disaster-playbooks/README.md): Exit codes (`0`, `1`, `137` OOMKilled, `139`), 3 broken Dockerfile challenges.
- [06-interview-prep-and-cheat-sheet](file:///c:/Users/chyuv/Desktop/Practice/docker-learning/06-interview-prep-and-cheat-sheet/README.md): Top 25 Senior Docker Interview Q&As.

### 2. ☸️ [Kubernetes Learning Hub](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/README.md)
*From Borg architecture to self-healing, rolling updates, and production clusters.*
- [01-architecture-and-mental-model](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/01-architecture-and-mental-model/README.md): The Google Borg origin story (2 billion containers/week), Control Plane vs Worker Nodes.
- [02-pods-and-replicasets](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/02-pods-and-replicasets/README.md): Pod lifecycles, manifests, and self-healing ReplicaSets.
- [03-deployments-and-rollouts](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/03-deployments-and-rollouts/README.md): Zero-downtime rolling updates, `maxSurge`/`maxUnavailable`, instant rollbacks.
- [04-services-networking-ingress](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/04-services-networking-ingress/README.md): ClusterIP, NodePort, LoadBalancer, and Ingress routing rules.
- [05-configmaps-secrets-storage](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/05-configmaps-secrets-storage/README.md): Environment configs, base64 Secrets, PersistentVolumes (PV) & PVCs for stateful databases.
- [06-production-reliability-hpa](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/06-production-reliability-hpa/README.md): Liveness/Readiness Probes, resource limits, Horizontal Pod Autoscaler (HPA).
- [07-disaster-playbooks-and-interview](file:///c:/Users/chyuv/Desktop/Practice/kubernetes-learning/07-disaster-playbooks-and-interview/README.md): The 5 Classic K8s Disasters (`CrashLoopBackOff`, `ImagePullBackOff`, `OOMKilled`, `Pending`), Top 20 Senior Interview Q&As.

### 3. 🏗️ [Terraform Learning Hub](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/README.md)
*Infrastructure as Code (IaC), remote state locking, and complete AWS EKS blueprints.*
- [01-foundations-and-clickops-disaster](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/01-foundations-and-clickops-disaster/README.md): The ClickOps disaster story, Providers, The 4-step workflow (`init`, `plan`, `apply`, `destroy`).
- [02-variables-outputs-and-state](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/02-variables-outputs-and-state/README.md): Parameterization, S3 Remote Backend + DynamoDB distributed state locking (`LockID`), state drift.
- [03-reusable-modules](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/03-reusable-modules/README.md): Reusable VPC Modules, multi-environment promotion (Dev vs Prod).
- [04-kubernetes-cloud-foundation](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/04-kubernetes-cloud-foundation/README.md): Complete production **AWS EKS Blueprint** (`eks-cluster.tf`, `vpc-for-eks.tf`).
- [05-interview-and-iac-playbooks](file:///c:/Users/chyuv/Desktop/Practice/terraform-learning/05-interview-and-iac-playbooks/README.md): Security scanning (`tfsec`, `checkov`), Top 20 Senior IaC Interview Q&As.

### 4. 🤖 [CI/CD & GitOps Learning Hub](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/README.md)
*GitHub Actions, multi-arch Docker Buildx, Trivy vulnerability gates, and ArgoCD.*
- [01-ci-foundations-and-github-actions](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/01-ci-foundations-and-github-actions/README.md): Triggers (`push`, `pull_request`), matrix testing (Node 20, 22), cleanroom sandbox execution.
- [02-docker-buildx-and-caching](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/02-docker-buildx-and-caching/README.md): Multi-platform builds (`amd64`/`arm64`), GitHub Actions cache (`type=gha`), immutable image tagging.
- [03-security-and-compliance-gates](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/03-security-and-compliance-gates/README.md): Trivy container vulnerability scanner, TruffleHog secret scanning, PR quality gates.
- [04-gitops-and-argocd](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/04-gitops-and-argocd/README.md): Pull-based deployment architecture, ArgoCD Application CRD (`argocd-application.yaml`), auto-sync and drift self-healing.
- [05-interview-and-production-playbooks](file:///c:/Users/chyuv/Desktop/Practice/cicd-gitops-learning/05-interview-and-production-playbooks/README.md): Leaked AWS secrets in CI logs, flaky test blockers, Top 20 Senior CI/CD & GitOps Interview Q&As.

### 5. 📊 [Observability, Monitoring & SRE Hub](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/README.md)
*Prometheus, Grafana, OpenTelemetry, Alertmanager, and Google SRE principles.*
- [01-prometheus-metrics-and-promql](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/01-prometheus-metrics-and-promql/README.md): Pull-based scraping, 4 core metric types, rate/irate calculations, and quantile calculations.
- [02-grafana-dashboards-and-visualization](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/02-grafana-dashboards-and-visualization/README.md): Complete production Kubernetes cluster dashboard JSON import model (`dashboard-k8s-cluster.json`), RED & USE methods.
- [03-distributed-tracing-opentelemetry](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/03-distributed-tracing-opentelemetry/README.md): Context propagation via W3C `traceparent` HTTP headers, Span creation, child spans, Jaeger / Tempo backend integration.
- [04-alerting-and-sre-practices](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/04-alerting-and-sre-practices/README.md): Alert deduplication, grouping, inhibition, SILENCES, SLIs vs SLOs vs Error Budgets, and production alerting rules (`alert-rules.yaml`).
- [05-interview-and-sre-playbook](file:///c:/Users/chyuv/Desktop/Practice/observability-sre-learning/05-interview-and-sre-playbook/README.md): The 3 AM Critical Outage Incident Response protocol, Blameless Post-Mortem template, Top 20 Senior SRE Interview Q&As.

### 🎓 6. [Capstone Production Stack](file:///c:/Users/chyuv/Desktop/Practice/99-capstone-production-stack/README.md)
*Run the real full loop on your local machine with Docker Desktop.*
- Instrumented Node.js microservice exporting Prometheus metrics (`/metrics`).
- Local Prometheus server scraping metrics every 5s.
- Local Grafana dashboard instance (`http://localhost:3001`).
- Included PowerShell traffic & chaos simulator (`simulate-traffic.ps1`).

---

## 🧭 Recommended Learning Path

```
Week 1-2: 🐳 Docker Fundamentals & Multi-Stage Builds
Week 3-4: ☸️ Kubernetes Pods, Deployments, Services & Ingress
Week 5-6: 🏗️ Terraform Infrastructure as Code & AWS EKS Blueprint
Week 7-8: 🤖 CI/CD Pipelines, Security Scanning & ArgoCD GitOps
Week 9-10: 📊 Observability, PromQL, Distributed Tracing & SRE Practices
Capstone:  🎓 Spin up the 99-capstone-production-stack and run chaos tests
```
