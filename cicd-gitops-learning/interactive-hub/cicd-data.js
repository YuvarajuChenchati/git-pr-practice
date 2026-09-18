// CI/CD & GitOps Interactive Mastery Data: Stories, Pipeline Models & Quiz
window.CICD_DATA = {
  stories: [
    {
      id: "ch1-friday-disaster",
      title: "Episode 1: The Friday 5 PM Disaster (The Manual Deployment Curse)",
      tagline: "How an engineer SSH'd into production on a Friday night, forgot one file, and ruined an entire weekend.",
      memeUrl: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      memeCaption: "Engineer: 'It is just a tiny 1-line change, I will just SSH into the server and patch it directly!'",
      content: `
### 💀 Friday, 4:58 PM
A developer finished a quick bugfix on their laptop:
- *"It works on my machine!"*
- Instead of waiting for tests, they SSH'd straight into production:
  \`\`\`bash
  ssh root@production-server
  git pull origin main
  pm2 restart all
  \`\`\`
- **The Tragedy**:
  - The developer had a local \`.env\` file with a Stripe secret key that was never pushed to Git.
  - The server started, threw an uncaught \`NullPointerException\` on checkout, and died.
  - Customers could not complete payments for 14 hours.
  - The developer spent their Friday night debugging in the dark with a frantic CEO calling every 10 minutes.

---

### 🛡️ The CI/CD Golden Rule
> **No human being ever deploys code manually.**  
> Every deployment must be automated, tested in clean sandboxes, and version-controlled through Git.
      `,
      takeaways: [
        "Manual SSH/FTP deployments are unrepeatable, unversioned, and prone to catastrophic human error.",
        "Automated CI runs unit tests, linters, and security checks on every single Pull Request.",
        "Production changes must go through the automated pipeline highway."
      ]
    },
    {
      id: "ch2-ci-highway",
      title: "Episode 2: The Continuous Integration (CI) Highway",
      tagline: "From git push to Docker image in 90 seconds flat: How GitHub Actions automates quality gates.",
      memeUrl: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
      memeCaption: "GitHub Actions runner executing 12 parallel test matrix jobs while you drink coffee.",
      content: `
### 🏎️ The 5 Steps of Modern Continuous Integration

\`\`\`
[ Developer Git Push ]
          │
          ▼
┌─────────────────────────────────┐
│ 1. Cleanroom Runner Boot        │ ➔ Fresh Ubuntu VM with zero local state
├─────────────────────────────────┤
│ 2. Install & Cache Dependencies │ ➔ npm ci / pip install (cached across runs)
├─────────────────────────────────┤
│ 3. Automated Test Suite         │ ➔ 100% unit & integration test coverage
├─────────────────────────────────┤
│ 4. Trivy Security CVE Scan      │ ➔ Fail build if Critical vulnerabilities exist
├─────────────────────────────────┤
│ 5. Docker Buildx & Registry     │ ➔ Multi-platform image pushed with Git SHA tag
└─────────────────────────────────┘
\`\`\`

If a developer writes broken code, the pipeline fails in **45 seconds** and blocks the Pull Request from merging into \`main\`!
      `,
      takeaways: [
        "Continuous Integration builds confidence by validating every single line of code.",
        "Quality gates (linting, tests, security scans) block broken code automatically.",
        "Layer caching in CI runners accelerates build speeds from minutes to seconds."
      ]
    },
    {
      id: "ch3-push-vs-pull",
      title: "Episode 3: The Push vs Pull Dilemma (Why Push-Based CD is Dead)",
      tagline: "Why giving your GitHub Actions runner admin access to Kubernetes is an architectural security hazard.",
      memeUrl: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      memeCaption: "Security team discovering someone put production cluster root credentials into GitHub Secrets.",
      content: `
### ⚠️ The Security Flaw of Push-Based CD
In legacy pipelines:
1. GitHub Actions runner finishes building.
2. The runner connects over the public internet into your Kubernetes cluster API.
3. To do this, **you had to store administrative cluster certificates inside GitHub Secrets!**
4. If an attacker compromises an npm dependency or PR workflow, **they can hijack your entire cluster**.

---

### 🛡️ The Pull-Based GitOps Revolution
- The deployment agent (**ArgoCD**) lives **INSIDE the Kubernetes cluster**.
- Zero cluster credentials ever leave the firewall!
- ArgoCD pulls manifests from Git over HTTPS.
- The Kubernetes cluster API is completely closed to the outside internet.
      `,
      takeaways: [
        "Push-based CD requires exposing cluster APIs to the public internet.",
        "Pull-based GitOps keeps credentials securely inside the cluster firewall.",
        "Git becomes the single source of truth for the entire infrastructure."
      ]
    },
    {
      id: "ch4-argocd-gitops",
      title: "Episode 4: ArgoCD & The GitOps Magic (Drift Self-Healing)",
      tagline: "What happens when someone manually edits a Kubernetes pod at 2 AM? ArgoCD fixes it in 3 seconds.",
      memeUrl: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
      memeCaption: "ArgoCD detecting someone ran 'kubectl edit' in production and immediately reverting it back to Git.",
      content: `
### 🕵️ The Rogue Sysadmin Experiment
Suppose a developer logs into production and runs:
\`\`\`bash
kubectl edit deployment payment-api
# Sets replicas = 1 to 'save memory'
\`\`\`
- In traditional pipelines, nobody would ever know.
- With **ArgoCD Automated Self-Healing**:
  1. ArgoCD detects the cluster state is \`OutOfSync\` with Git (Git says 4 replicas, cluster has 1).
  2. In **3 seconds**, ArgoCD triggers an auto-sync.
  3. Overwrites the rogue change and restores all 4 replicas!
  4. Git remains the supreme source of truth!
      `,
      takeaways: [
        "GitOps enforces that cluster state matches Git state continuously.",
        "ArgoCD self-healing prevents configuration drift and manual rogue tampering.",
        "Auditing is effortless: every change in production is tied to a Git commit author."
      ]
    },
    {
      id: "ch5-progressive-delivery",
      title: "Episode 5: Canary Deployments & Progressive Delivery",
      tagline: "Routing 5% of real user traffic to test a new version safely before rolling out to 100%.",
      memeUrl: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeCaption: "Senior DevOps watching the Canary deployment route 5% traffic while Prometheus checks 0 errors.",
      content: `
### 🐦 The Coal Mine Canary
In coal mines, miners took a canary into the tunnels. If toxic gas leaked, the canary reacted first, saving the miners.
In **Progressive Delivery (Argo Rollouts / Flagger)**:
1. Deploy \`v2\` of your API.
2. Route **5% of user traffic** to \`v2\`, and 95% to stable \`v1\`.
3. Prometheus monitors HTTP 5xx error rates and latency.
4. If errors spike, K8s immediately cuts traffic from \`v2\` and rolls back to \`v1\` in **200 milliseconds**!
5. If errors stay at 0.00%, traffic increases to 25% ➔ 50% ➔ 100%!
      `,
      takeaways: [
        "Canary deployments eliminate the risk of big-bang production releases.",
        "Prometheus metrics automate the decision to promote or roll back releases.",
        "Zero downtime, zero user disruption, zero stress."
      ]
    }
  ],

  // Quiz Arena Data
  quizChallenges: [
    {
      id: 1,
      title: "The Leaked AWS Secret Incident",
      scenario: "A junior developer wrote `echo 'AWS_KEY=' + $AWS_SECRET_ACCESS_KEY` in a bash debugging step inside a GitHub Actions workflow. The key was printed to the public build logs. How should you fix and prevent this?",
      memeCorrect: "https://media.giphy.com/media/2bYewTk7K2No1NvcuK/giphy.gif",
      memeWrong: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      options: [
        "Immediately revoke the AWS key, switch to AWS OpenID Connect (OIDC) so GitHub uses temporary 15-minute STS tokens, and enable automated secret masking.",
        "Delete the GitHub build history and pretend it never happened.",
        "Rename the secret in GitHub settings.",
        "Reboot the AWS EC2 instance."
      ],
      correctIndex: 0,
      explanation: "Printed secrets in CI logs must be immediately revoked in AWS IAM! The modern enterprise standard is AWS OIDC, which eliminates static long-lived access keys entirely, exchanging temporary 15-minute tokens per workflow run!"
    },
    {
      id: 2,
      title: "The 25-Minute CI Build Nightmare",
      scenario: "Every time a developer pushes code, the GitHub Actions Docker build takes 25 minutes because it downloads 800MB of npm dependencies from scratch. How do you slash this build time to under 1 minute?",
      memeCorrect: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      options: [
        "Upgrade GitHub Actions to a 128-core enterprise runner.",
        "Enable Docker Buildx with GitHub Actions Cache: `cache-from: type=gha` and `cache-to: type=gha,mode=max` to persist cached layers across runs!",
        "Delete all tests to make it faster.",
        "Stop building Docker images in CI."
      ],
      correctIndex: 1,
      explanation: "GitHub Actions runners are ephemeral. Without cache export, layer caches are lost after every run. Using `type=gha` exports BuildKit cache layers to GitHub's cache storage, making rebuilds instant!"
    },
    {
      id: 3,
      title: "The ArgoCD OutOfSync Fight",
      scenario: "You deploy a Kubernetes deployment via ArgoCD. In your Git repo, `replicas: 2`. However, you configured a Horizontal Pod Autoscaler (HPA) that scales pods to 8 during peak traffic. ArgoCD constantly marks the app 'OutOfSync' and tries to scale it back down to 2. How do you solve this?",
      memeCorrect: "https://media.giphy.com/media/l4pMattUYTTM7qpIk/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      options: [
        "Add `ignoreDifferences` for `spec.replicas` in the ArgoCD Application manifest so ArgoCD lets HPA manage scaling.",
        "Delete the Horizontal Pod Autoscaler.",
        "Disable ArgoCD completely.",
        "Update the Git repository every 5 seconds with the new replica count."
      ],
      correctIndex: 0,
      explanation: "The `ignoreDifferences` spec tells ArgoCD to ignore runtime mutations performed by Kubernetes controllers (like HPA). This allows HPA to scale pods dynamically without ArgoCD fighting it!"
    },
    {
      id: 4,
      title: "The ':latest' Image Tag Trap",
      scenario: "Your deployment uses `image: my-app:latest`. A bug is pushed to production, and you run `kubectl rollout undo` to roll back to the previous release. The rollback succeeds, but the bug is still there! Why?",
      memeCorrect: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      memeWrong: "https://media.giphy.com/media/11StaZ9Lj75oCY/giphy.gif",
      options: [
        "Kubernetes rollback is broken.",
        "Because `:latest` is mutable! Both the current and previous ReplicaSets pointed to the same tag (`:latest`), which now points to the buggy image! Always tag images with immutable Git commit SHAs!",
        "Docker Hub cached the image incorrectly.",
        "The browser did not clear its cookies."
      ],
      correctIndex: 1,
      explanation: "Never use `:latest` in production! If you push buggy code with `:latest`, the previous ReplicaSet also points to `:latest`, making rollbacks completely useless! Always tag with immutable versions like `v1.2.0-sha-7a8b9c`!"
    },
    {
      id: 5,
      title: "Shift-Left Security Gate",
      scenario: "A developer merges a PR that introduces a high-severity Remote Code Execution (RCE) vulnerability in an outdated npm library. How should the CI pipeline prevent this from ever reaching production?",
      memeCorrect: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xThuW4BaAA2f7nRvoc/giphy.gif",
      options: [
        "Wait for customers to report it.",
        "Integrate Aqua Trivy in CI with `exit-code: 1` on `severity: CRITICAL,HIGH`. The scanner fails the pipeline and blocks the PR from merging!",
        "Disable open-source libraries.",
        "Send an email to the developer after deployment."
      ],
      correctIndex: 1,
      explanation: "DevSecOps quality gates block vulnerabilities at the Pull Request stage. Tools like Trivy and Snyk inspect OS and library CVEs, failing the build and preventing vulnerable containers from ever being built or deployed!"
    }
  ],

  // Pipeline Simulator Stages
  pipelineStages: [
    { id: "stage-git", name: "1. Git Push (main)", icon: "🐙", status: "Ready", desc: "Commit sha: 8f9b2c1" },
    { id: "stage-test", name: "2. Lint & Unit Tests", icon: "🧪", status: "Ready", desc: "Jest & ESLint runner" },
    { id: "stage-scan", name: "3. Trivy Security Scan", icon: "🛡️", status: "Ready", desc: "CVE & Secret Audit" },
    { id: "stage-build", name: "4. Docker Buildx & ECR", icon: "🐳", status: "Ready", desc: "Multi-arch image build" },
    { id: "stage-gitops", name: "5. ArgoCD Sync ➔ K8s", icon: "🐙", status: "Ready", desc: "Zero-Downtime Rollout" }
  ]
};
