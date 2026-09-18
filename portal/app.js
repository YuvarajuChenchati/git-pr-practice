// ==============================================================================
// Grand Unified Cloud & DevOps Mission Control - Logic
// ==============================================================================

// --- Tab Switching ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const target = document.getElementById(btn.getAttribute('data-tab'));
    if (target) target.classList.add('active');
  });
});

// --- Scenario Stepper Data ---
let currentStep = 1;

const scenarioSteps = {
  1: {
    tag: 'PHASE 1 OF 5',
    title: 'Packaging the Microservice (Docker)',
    desc: 'The software team pushes the new checkout microservice. Our multi-stage Dockerfile uses node:20-alpine to strip devDependencies, runs with unprivileged user node, and integrates dumb-init for PID 1 signal handling.',
    buttonText: '▶ Build & Package Image',
    command: 'docker build -t ecom-checkout:v1.4.0 ./app\ndocker scan ecom-checkout:v1.4.0',
    log: `$ docker build -t ecom-checkout:v1.4.0 ./app
[+] Building 3.8s (12/12) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 520B
 => [stage-1 1/4] FROM docker.io/library/node:20-alpine
 => [builder 2/3] RUN npm ci --only=production
 => [stage-1 3/4] COPY --from=builder /usr/src/app/node_modules ./node_modules
 => [stage-1 4/4] COPY server.js ./
 => exporting to image
 => => exporting layers
 => => naming to docker.io/library/ecom-checkout:v1.4.0

SUCCESS: Image built! Size: 54.2MB (Reduced by 97.2% vs ubuntu base)`,
    diagram: `
      <div style="text-align:center; padding: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🐳</div>
        <div style="color:#38bdf8; font-weight:700; font-size:1.1rem;">ecom-checkout:v1.4.0</div>
        <div style="font-size:0.85rem; color:#94a3b8; margin-top:0.35rem;">Base: Alpine 3.19 | Distroless Profile | Non-Root node (UID 1000)</div>
        <div style="margin-top:1rem; display:inline-block; padding:0.35rem 0.75rem; background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; color:#10b981; font-size:0.8rem; font-weight:600;">
          Trivy Scan: 0 Critical / 0 High Vulnerabilities
        </div>
      </div>
    `
  },
  2: {
    tag: 'PHASE 2 OF 5',
    title: 'Provisioning Cloud Infrastructure (Terraform)',
    desc: 'We define the AWS Cloud VPC (3 Public, 3 Private Subnets across us-east-1a, 1b, 1c), Internet Gateway, NAT Gateways, and the AWS EKS Kubernetes Cluster with managed node groups.',
    buttonText: '▶ Run Terraform Apply',
    command: 'terraform plan -out=tfplan.binary\nterraform apply tfplan.binary',
    log: `$ terraform apply tfplan.binary
Acquiring state lock on DynamoDB table 'terraform-locks'...
module.vpc.aws_vpc.main: Creating... [id=vpc-0a8b9c]
module.vpc.aws_subnet.private[0]: Creating... [id=subnet-011a]
module.vpc.aws_nat_gateway.nat: Creating... [id=nat-0987]
module.eks.aws_eks_cluster.prod: Creating...
module.eks.aws_eks_node_group.workers: Creating... [3 nodes active]

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.
Outputs:
  cluster_endpoint = "https://A7B8C9.gr7.us-east-1.eks.amazonaws.com"
  cluster_name = "ecom-production-eks"`,
    diagram: `
      <div style="width:100%; border:1px dashed #a855f7; border-radius:8px; padding:1rem; text-align:center;">
        <span style="font-size:0.75rem; color:#c084fc; font-weight:700;">AWS REGION (us-east-1) - VPC 10.0.0.0/16</span>
        <div style="display:flex; justify-content:space-around; margin-top:1rem; gap:0.5rem;">
          <div style="flex:1; background:rgba(59,130,246,0.1); border:1px solid #3b82f6; border-radius:6px; padding:0.5rem; font-size:0.75rem;">
            <strong>Public Subnets</strong><br>ALB Ingress (Public IP)
          </div>
          <div style="flex:1; background:rgba(168,85,247,0.1); border:1px solid #a855f7; border-radius:6px; padding:0.5rem; font-size:0.75rem;">
            <strong>Private Subnets</strong><br>EKS Worker Nodes (No Public IP)
          </div>
        </div>
      </div>
    `
  },
  3: {
    tag: 'PHASE 3 OF 5',
    title: 'Deploying Workloads & Routing (Kubernetes)',
    desc: 'Deploy the Deployment manifest with 3 replicas, livenessProbe (/healthz), readinessProbe (/readyz), resource requests/limits, ClusterIP Service, and Ingress routing rules.',
    buttonText: '▶ Apply Kubernetes Manifests',
    command: 'kubectl apply -f deployment.yaml\nkubectl apply -f service-ingress.yaml',
    log: `$ kubectl apply -f deployment.yaml -f service-ingress.yaml
deployment.apps/ecom-checkout created
service/ecom-checkout-svc created
ingress.networking.k8s.io/ecom-ingress created

$ kubectl get pods -l app=ecom-checkout
NAME                             READY   STATUS    RESTARTS   AGE
ecom-checkout-7dfb9c8b74-k81a    1/1     Running   0          6s
ecom-checkout-7dfb9c8b74-m42x    1/1     Running   0          6s
ecom-checkout-7dfb9c8b74-z99q    1/1     Running   0          6s

All 3 Pods healthy & receiving Ingress traffic via ClusterIP:80`,
    diagram: `
      <div style="display:flex; flex-direction:column; gap:0.5rem; width:100%; align-items:center;">
        <div style="background:#1e293b; border:1px solid #38bdf8; border-radius:6px; padding:0.4rem 1.5rem; font-size:0.8rem; font-weight:700; color:#38bdf8;">
          🌐 NGINX Ingress Controller (https://shop.company.com/api/checkout)
        </div>
        <div style="font-size:1.2rem; color:#64748b;">⬇</div>
        <div style="background:#0f172a; border:1px solid #3b82f6; border-radius:6px; padding:0.4rem 1.2rem; font-size:0.8rem; color:#60a5fa;">
          ⚙️ Service: ecom-checkout-svc (ClusterIP: 10.96.42.18)
        </div>
        <div style="font-size:1.2rem; color:#64748b;">⬇</div>
        <div style="display:flex; gap:0.5rem;">
          <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.75rem; color:#10b981;">Pod #1 (Healthy)</div>
          <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.75rem; color:#10b981;">Pod #2 (Healthy)</div>
          <div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.75rem; color:#10b981;">Pod #3 (Healthy)</div>
        </div>
      </div>
    `
  },
  4: {
    tag: 'PHASE 4 OF 5',
    title: 'Automated CI/CD & GitOps Sync (GitHub Actions + ArgoCD)',
    desc: 'A pull request is merged into main. GitHub Actions runs unit tests, scans security with Trivy, pushes multi-arch images, and ArgoCD reconciles the Git manifests to the live cluster in 8 seconds.',
    buttonText: '▶ Trigger Git Push & ArgoCD Sync',
    command: 'git push origin main\nargocd app sync ecom-production',
    log: `$ git push origin main
Triggering GitHub Actions Workflow: .github/workflows/production-pipeline.yml
- [x] Run Tests (Node 20, 22) -> PASSED (48 tests)
- [x] Trivy Vulnerability Scan -> 0 Critical CVEs found
- [x] Docker Buildx Push -> ghcr.io/org/ecom-checkout:v1.4.1
- [x] Update GitOps Manifest repo commit sha: 7e9b21f

$ argocd app sync ecom-production
TIMESTAMP                  GROUP        KIND   NAMESPACE                  NAME    STATUS   HEALTH
2026-09-17T17:20:10Z   apps  Deployment  production         ecom-checkout    Synced  Progressing
2026-09-17T17:20:16Z   apps  Deployment  production         ecom-checkout    Synced  Healthy

GitOps Reconciled: Desired State == Live Cluster State!`,
    diagram: `
      <div style="width:100%; text-align:center;">
        <div style="display:flex; justify-content:center; align-items:center; gap:0.5rem; font-size:0.8rem;">
          <span style="background:rgba(245,158,11,0.15); border:1px solid #f59e0b; padding:0.35rem 0.6rem; border-radius:6px; color:#fbbf24;">Git Commit (v1.4.1)</span>
          <span>➔</span>
          <span style="background:rgba(59,130,246,0.15); border:1px solid #3b82f6; padding:0.35rem 0.6rem; border-radius:6px; color:#60a5fa;">GitHub Actions</span>
          <span>➔</span>
          <span style="background:rgba(16,185,129,0.15); border:1px solid #10b981; padding:0.35rem 0.6rem; border-radius:6px; color:#34d399;">ArgoCD Pull Sync</span>
        </div>
        <div style="margin-top:1rem; font-size:0.75rem; color:#94a3b8;">Status: <strong>SYNCED</strong> | Health: <strong>HEALTHY</strong> | Drift: <strong>0.00%</strong></div>
      </div>
    `
  },
  5: {
    tag: 'PHASE 5 OF 5',
    title: 'Surge Traffic & SRE Self-Healing (Prometheus + HPA)',
    desc: 'Black Friday flash sale hits! Traffic surges from 200 RPS to 14,500 RPS. Prometheus detects CPU/latency spikes, Alertmanager signals HPA, and Kubernetes autoscales from 3 to 12 Pods in seconds, keeping P99 latency under 45ms.',
    buttonText: '▶ Simulate 14,500 RPS Surge & Auto-Scale',
    command: 'hey -n 50000 -c 250 http://shop.company.com/api/checkout\nkubectl get hpa -w',
    log: `$ hey -n 50000 -c 250 http://shop.company.com/api/checkout
[TRAFFIC SURGE DETECTED]: 14,500 requests/sec arriving at Ingress!
Prometheus: rate(http_requests_total[1m]) = 14,512.4 req/s
CPU Saturation: Pod average climbing to 88%

HorizontalPodAutoscaler TRIGGERED:
ecom-hpa   Deployment/ecom-checkout   88%/60%   3 -> 7 -> 12 Replicas

[AUTOSCALING EVENT COMPLETED]:
12 Pods active across 3 Worker Nodes.
Error Rate: 0.01% | P95 Latency: 24ms | P99 Latency: 42ms
SLO Preserved: 99.99% Availability maintained during peak sale!`,
    diagram: `
      <div style="width:100%; text-align:center;">
        <div style="font-size:0.85rem; font-weight:700; color:#ef4444; margin-bottom:0.5rem;">🔥 LIVE TRAFFIC: 14,500 RPS</div>
        <div style="display:flex; justify-content:center; gap:0.25rem; flex-wrap:wrap; margin-bottom:0.75rem;">
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 1</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 2</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 3</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 4</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 5</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 6</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 7</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 8</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 9</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 10</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 11</span>
          <span style="background:#10b981; color:#000; font-size:0.65rem; font-weight:700; padding:0.2rem 0.4rem; border-radius:4px;">Pod 12</span>
        </div>
        <div style="font-size:0.75rem; color:#10b981; font-weight:600;">Auto-scaled to 12 Replicas! 0 Downtime. 0 Drops.</div>
      </div>
    `
  }
};

function jumpToStep(stepNum) {
  currentStep = stepNum;
  document.querySelectorAll('.step-nav').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === stepNum);
  });

  const data = scenarioSteps[stepNum];
  document.getElementById('scenario-stage-tag').textContent = data.tag;
  document.getElementById('scenario-title').textContent = data.title;
  document.getElementById('scenario-desc').textContent = data.desc;
  document.getElementById('scenario-run-btn').textContent = data.buttonText;
  document.getElementById('scenario-action-status').textContent = 'Ready to execute';
  document.getElementById('scenario-action-status').style.color = '#94a3b8';
  document.getElementById('scenario-log').textContent = `// Ready. Click '${data.buttonText}' to run this stage.`;
  document.getElementById('scenario-diagram').innerHTML = data.diagram;
}

function executeCurrentStep() {
  const data = scenarioSteps[currentStep];
  const logEl = document.getElementById('scenario-log');
  const statusEl = document.getElementById('scenario-action-status');

  statusEl.textContent = '⚡ Running...';
  statusEl.style.color = '#38bdf8';
  logEl.textContent = `Executing command: ${data.command}\n...\n`;

  setTimeout(() => {
    logEl.textContent = data.log;
    statusEl.textContent = '✅ Phase Completed Successfully!';
    statusEl.style.color = '#10b981';

    // Auto-advance indicator if not last step
    if (currentStep < 5) {
      setTimeout(() => {
        statusEl.textContent = `✅ Ready for Step ${currentStep + 1}!`;
      }, 1500);
    }
  }, 600);
}

// Initialize Step 1 on load
jumpToStep(1);

// --- DevOps Career Matrix & Skill Tree ---
const careerSkills = [
  { cat: '🐳 Docker & Packaging', skills: [
    'Linux namespaces & cgroups isolation',
    'Multi-stage builds (reducing size by >90%)',
    'PID 1 zombie reaping and tini signals',
    'Named volumes vs bind mounts persistence'
  ]},
  { cat: '☸️ Kubernetes Orchestration', skills: [
    'Control Plane vs Kubelet architecture',
    'Deployments & zero-downtime rolling updates',
    'Services (ClusterIP/NodePort) & Ingress routing',
    'Liveness/Readiness probes & HPA autoscaling'
  ]},
  { cat: '🏗️ Terraform Infrastructure as Code', skills: [
    'Declarative HCL & the 4-step workflow',
    'S3 remote state + DynamoDB distributed locks',
    'Reusable VPC & Subnet modules',
    'Production AWS EKS Cluster blueprint'
  ]},
  { cat: '🤖 CI/CD & GitOps Automation', skills: [
    'GitHub Actions workflow automation & caching',
    'Multi-arch Docker Buildx image pushes',
    'Trivy & TruffleHog security quality gates',
    'ArgoCD pull-based GitOps sync & drift recovery'
  ]},
  { cat: '📊 Observability & SRE', skills: [
    'Prometheus scraping & PromQL rate/quantile queries',
    'Grafana Four Golden Signals dashboards',
    'OpenTelemetry distributed tracing context headers',
    'SLI/SLO error budgets & Alertmanager rules'
  ]}
];

function loadSkillsState() {
  const saved = localStorage.getItem('devops_mastery_skills');
  return saved ? JSON.parse(saved) : {};
}

function saveSkillsState(state) {
  localStorage.setItem('devops_mastery_skills', JSON.stringify(state));
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  const state = loadSkillsState();
  container.innerHTML = '';

  let totalSkills = 0;
  let masteredCount = 0;

  careerSkills.forEach(catObj => {
    const card = document.createElement('div');
    card.className = 'skill-category-card';

    let itemsHtml = `<div class="skill-cat-title">${catObj.cat}</div>`;
    catObj.skills.forEach(skill => {
      totalSkills++;
      const isChecked = !!state[skill];
      if (isChecked) masteredCount++;

      itemsHtml += `
        <label class="skill-item ${isChecked ? 'completed' : ''}">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleSkill('${skill}', this.checked)">
          <span>${skill}</span>
        </label>
      `;
    });

    card.innerHTML = itemsHtml;
    container.appendChild(card);
  });

  // Calculate Standing
  const percent = Math.round((masteredCount / totalSkills) * 100);
  document.getElementById('xp-bar').style.width = `${percent}%`;
  document.getElementById('xp-text').textContent = `${masteredCount} / ${totalSkills} Skills Mastered (${percent}%)`;

  let badge = '🌱';
  let title = 'Junior Container Apprentice';

  if (percent >= 90) {
    badge = '👑';
    title = 'Principal Cloud Architect & SRE God';
  } else if (percent >= 70) {
    badge = '🚀';
    title = 'Lead DevOps & Platform Engineer';
  } else if (percent >= 45) {
    badge = '⚡';
    title = 'Senior Cloud & Infrastructure Engineer';
  } else if (percent >= 20) {
    badge = '🛠️';
    title = 'DevOps Practitioner';
  }

  document.getElementById('rank-badge').textContent = badge;
  document.getElementById('rank-title').textContent = title;
}

function toggleSkill(skill, isChecked) {
  const state = loadSkillsState();
  if (isChecked) {
    state[skill] = true;
  } else {
    delete state[skill];
  }
  saveSkillsState(state);
  renderSkills();
}

function resetSkills() {
  if (confirm('Reset your DevOps skill tracker?')) {
    localStorage.removeItem('devops_mastery_skills');
    renderSkills();
  }
}

// Initialize Skills
renderSkills();

// --- Universal Command Finder Data ---
const commandsDatabase = [
  { tool: 'docker', title: 'Diagnose OOMKilled Container', snippet: 'docker inspect <container> --format \'{{.State.OOMKilled}}\'', desc: 'Returns true if container was killed by Linux kernel cgroup OOM' },
  { tool: 'docker', title: 'Clean Unused Images & Volumes', snippet: 'docker system prune -af --volumes', desc: 'Slashes disk usage by removing dangling layers, stopped containers, and unused volumes' },
  { tool: 'docker', title: 'Test Embedded DNS Resolution', snippet: 'docker run --rm --net custom-net busybox nslookup app-service', desc: 'Verifies container-to-container internal DNS resolution on 127.0.0.11' },

  { tool: 'kubernetes', title: 'Find Why Pod is Failing (Events)', snippet: 'kubectl describe pod <pod-name> | grep -A 10 Events:', desc: 'Instantly surfaces ImagePullBackOff, CrashLoopBackOff, or Liveness probe failures' },
  { tool: 'kubernetes', title: 'Instant Zero-Downtime Rollback', snippet: 'kubectl rollout undo deployment/<deployment-name>', desc: 'Reverts a bad release to the previous known-good ReplicaSet in seconds' },
  { tool: 'kubernetes', title: 'Force Pod Eviction for Node Drain', snippet: 'kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data', desc: 'Safely reschedules all workloads to other worker nodes before maintenance' },

  { tool: 'terraform', title: 'Force State Unlock on Crash', snippet: 'terraform force-unlock <lock-id>', desc: 'Releases a stuck DynamoDB distributed lock when a CI runner crashes midway' },
  { tool: 'terraform', title: 'Targeted Plan for Single Resource', snippet: 'terraform plan -target=module.eks.aws_eks_cluster.prod', desc: 'Isolates and plans changes for a single resource without scanning the full state' },
  { tool: 'terraform', title: 'Detect Cloud Drift from Console', snippet: 'terraform plan -refresh-only', desc: 'Scans real AWS cloud and surfaces ClickOps changes without making modifications' },

  { tool: 'cicd', title: 'Scan Container Image with Trivy', snippet: 'trivy image --severity HIGH,CRITICAL --exit-code 1 <image>', desc: 'Breaks the CI build if vulnerabilities above acceptable threshold are found' },
  { tool: 'cicd', title: 'ArgoCD Force Manual Sync', snippet: 'argocd app sync <app-name> --force --prune', desc: 'Forces ArgoCD to immediately sync and prune any drifted resources' },
  { tool: 'cicd', title: 'Docker Buildx with GitHub Cache', snippet: 'docker buildx build --cache-from=type=gha --cache-to=type=gha,mode=max -t myapp .', desc: 'Builds multi-platform image utilizing GitHub Actions persistent layer cache' },

  { tool: 'sre', title: 'Calculate P95 Latency Over 5m', snippet: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))', desc: 'Computes the 95th percentile request duration across all microservice instances' },
  { tool: 'sre', title: 'Calculate Total 5xx Error Rate %', snippet: 'sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100', desc: 'Surfaces overall error rate percentage to verify SLO budget consumption' },
  { tool: 'sre', title: 'Find Memory Leaking Pods Climbing Rate', snippet: 'topk(5, deriv(container_memory_working_set_bytes[15m]) > 0)', desc: 'Identifies the top 5 pods whose memory usage has a positive derivative slope' }
];

let activeFilter = 'all';

function setCommandFilter(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  filterCommands();
}

function filterCommands() {
  const query = document.getElementById('command-search-input').value.toLowerCase();
  const container = document.getElementById('commands-container');
  container.innerHTML = '';

  const filtered = commandsDatabase.filter(cmd => {
    const matchesFilter = activeFilter === 'all' || cmd.tool === activeFilter;
    const matchesQuery = cmd.title.toLowerCase().includes(query) ||
                         cmd.snippet.toLowerCase().includes(query) ||
                         cmd.desc.toLowerCase().includes(query) ||
                         cmd.tool.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem;">No commands found matching "${query}". Try another search term!</div>`;
    return;
  }

  filtered.forEach(cmd => {
    const card = document.createElement('div');
    card.className = 'command-card';

    card.innerHTML = `
      <div class="cmd-info">
        <div class="cmd-tags">
          <span class="cmd-pill ${cmd.tool}">${cmd.tool}</span>
          <strong style="font-size:0.95rem;">${cmd.title}</strong>
        </div>
        <p class="cmd-desc">${cmd.desc}</p>
        <div class="cmd-snippet">${cmd.snippet}</div>
      </div>
      <button class="copy-cmd-btn" onclick="copySnippet('${cmd.snippet.replace(/'/g, "\\'")}', this)">📋 Copy</button>
    `;

    container.appendChild(card);
  });
}

function copySnippet(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.style.background = '#10b981';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);
  });
}

// Initial render
filterCommands();
