// Kubernetes Interactive Mastery Hub: Stories, Cluster Models & Quiz Data
window.K8S_DATA = {
  stories: [
    {
      id: "ch1-borg-origin",
      title: "Episode 1: The Borg Origin — 2 Billion Containers a Week at Google",
      tagline: "How Google built a supercomputer out of 100,000 failing servers and gave Kubernetes to humanity.",
      memeUrl: "https://media.giphy.com/media/IZY2SE2JmPgFG/giphy.gif",
      memeCaption: "Google: 'We launch 2 billion containers every single week.' Developer: 'I managed to run 3 in Docker Desktop!'",
      content: `
### 🚀 The Secret World of Google Datacenters (2003)
In the early 2000s, Google was expanding faster than human beings could rack servers.
When a hard drive crashed, nobody drove to the datacenter at 3 AM.
Instead, Google engineers designed an internal, classified cluster management system named **Borg**:
- Borg viewed 10,000 servers not as individual machines, but as **one giant pool of compute, RAM, and disk**.
- When an engineer wanted to deploy Google Maps, they didn't ask: *"Which server has free memory?"*
- They simply declared: *"Borg, ensure 4,000 instances of Google Maps are alive at all times."*
- Borg launched over **2,000,000,000 (2 Billion) containers every week**.

---

### ☸️ The 2014 Open Source Revolution
In 2014, Google took 10 years of production battle scars from Borg and wrote a brand new system in Go:
They named it **Kubernetes** (Greek for *"Helmsman"* or *"Captain of the Ship"*, hence the 7-spoked ship wheel logo ☸️).
They open-sourced it under the Cloud Native Computing Foundation (CNCF).
Today, whether you run on AWS EKS, Google Cloud GKE, Azure AKS, or bare-metal datacenters, Kubernetes is the undisputed cloud operating system of the world.
      `,
      takeaways: [
        "Kubernetes was born from Google's internal Borg system, battle-tested on billions of containers.",
        "It treats fleets of machines like a single elastic computer.",
        "Declarative desired state: Tell K8s what you want, let it handle the chaos of hardware failures."
      ]
    },
    {
      id: "ch2-brain-vs-muscle",
      title: "Episode 2: The Control Plane (Brain) vs Worker Nodes (Muscle)",
      tagline: "The master-worker anatomy: Who makes decisions and who does the heavy lifting.",
      memeUrl: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeCaption: "Kube-scheduler: 'I analyze 10,000 parameters just to pick the best node for your 10MB container.'",
      content: `
### 🧠 The Control Plane: The Mastermind
1. **kube-apiserver**: The only entrance into the cluster. Every command (\`kubectl\`) and every internal controller talks strictly to the API server via REST.
2. **etcd**: The brain's infallible memory. A distributed key-value store holding the single source of truth for the entire cluster.
3. **kube-scheduler**: The placement matchmaker. Looks at new pods and decides which worker node has enough free CPU and memory.
4. **kube-controller-manager**: The eternal watchdog running reconciliation loops (Node Controller, ReplicaSet Controller, EndpointSlice Controller).

---

### 💪 Worker Nodes: The Muscle
1. **kubelet**: The captain stationed on every worker node. Receives instructions from the API server, commands the container runtime, and continuously checks container pulse.
2. **kube-proxy**: The traffic cop. Configures Linux \`iptables\` to route network requests across pods.
3. **Container Runtime (containerd)**: The actual engine that pulls images and runs container processes.
      `,
      takeaways: [
        "The Control Plane makes decisions; Worker Nodes execute the workloads.",
        "etcd holds the single source of truth (backup etcd or face total cluster amnesia!).",
        "Kubelet is the bridge between the API server and the container runtime."
      ]
    },
    {
      id: "ch3-self-healing",
      title: "Episode 3: The Self-Healing Miracle (Why You Sleep at 3 AM)",
      tagline: "How the reconciliation loop detects failures and resurrects dead containers without human intervention.",
      memeUrl: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
      memeCaption: "Sysadmin in 2010: Woken up at 3 AM by pager. DevOps in 2026: Kubernetes revived 8 pods while they slept.",
      content: `
### 🔄 The Infinite Reconciliation Loop
Kubernetes does not panic when things break. It runs a continuous mathematical formula:
\`\`\`text
Reconciliation Loop:
IF (Current State != Desired State) THEN
    Take corrective action until (Current State == Desired State)
\`\`\`

- **You declare**: *"I want 4 replicas of my Payment API."*
- **Disaster strikes**: Worker Node 2 suffers a power outage. 2 pods vanish instantly.
- **Current State**: 2 pods.
- **Desired State**: 4 pods.
- **The Controller Manager**: Detects the discrepancy in 50 milliseconds.
- **The Scheduler**: Finds Node 1 and Node 3 have free memory.
- **The Kubelet**: Launches 2 brand-new replacement pods on healthy nodes.
- **Result**: Cluster is 100% healthy again before anyone's alarm clock rings!
      `,
      takeaways: [
        "Kubernetes operates on Desired State vs Current State reconciliation.",
        "Pods are ephemeral and replaceable: treat them like cattle, not pets.",
        "Controller Manager and Scheduler automatically heal failed pods across remaining healthy nodes."
      ]
    },
    {
      id: "ch4-zero-downtime",
      title: "Episode 4: The Zero-Downtime Rolling Update & Instant Rollback",
      tagline: "Deploying production updates at 2 PM on a Tuesday without a single dropped HTTP connection.",
      memeUrl: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeCaption: "Senior DevOps: Upgrading 50 microservices in the middle of peak traffic without dropping a single packet.",
      content: `
### 🚢 The Blue/Green & Rolling Update Magic
In the old days, deploying an update meant:
1. Turn off the website: *"Under Maintenance"* screen.
2. Replace files.
3. Restart server.
4. Pray it boots!

With Kubernetes **Deployments**:
- Version 1 is running across 4 pods.
- You apply \`deployment-v2.yaml\`.
- K8s creates a new ReplicaSet for \`v2\`.
- It spins up pod 1 of \`v2\`.
- Once \`v2\` passes its **ReadinessProbe** (HTTP 200 OK), K8s starts routing user traffic to it.
- Only then does K8s terminate pod 1 of \`v1\`!
- It repeats this step by step. **Zero seconds of downtime!**
- If \`v2\` crashes? Run \`kubectl rollout undo\` and it switches back to \`v1\` in **1 second**!
      `,
      takeaways: [
        "Deployments manage ReplicaSets to orchestrate zero-downtime rolling updates.",
        "Readiness probes ensure no traffic hits a new container until it is fully initialized.",
        "Rollback is instantaneous with `kubectl rollout undo`."
      ]
    },
    {
      id: "ch5-ingress-traffic",
      title: "Episode 5: The Ingress & Service Router (How Traffic Finds Pods)",
      tagline: "When pods change IP addresses every hour, how does the user in Chrome reach them?",
      memeUrl: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
      memeCaption: "Kube-proxy and CoreDNS navigating millions of packets through a maze of dynamic pod IPs.",
      content: `
### 🚦 Why Pod IPs Can Never Be Trusted
In Docker, you might have hardcoded \`172.17.0.2\`.
In Kubernetes, **Pods die and get recreated constantly**. Every time a pod is recreated, it gets a brand-new IP address!

### 🛡️ The Service: The Eternal Virtual Anchor
A **Service** provides:
- A stable, unchanging virtual IP (**ClusterIP**).
- An internal DNS name (e.g. \`http://auth-service\`).
- A dynamic load balancer that automatically tracks healthy pod IPs using **Label Selectors** (\`app: auth\`).

### 🌐 The Ingress: The Smart Front Door
While Services handle internal Layer 4 (TCP) traffic, **Ingress** handles Layer 7 (HTTP):
- One single external Cloud IP.
- URL Routing: \`shop.com/api\` ➔ Backend Service, \`shop.com/\` ➔ Frontend Service.
- Automated SSL/TLS termination with Let's Encrypt certificates!
      `,
      takeaways: [
        "Never connect to a Pod IP directly; always connect through a Service.",
        "ClusterIP provides internal service discovery via CoreDNS.",
        "Ingress acts as the intelligent Layer 7 reverse proxy routing public domains to internal services."
      ]
    }
  ],

  // Quiz Arena Data
  quizChallenges: [
    {
      id: 1,
      title: "The Dreaded CrashLoopBackOff",
      scenario: "You deploy a new Node.js microservice. You run `kubectl get pods` and notice the status says `CrashLoopBackOff`, and the `RESTARTS` count is rapidly climbing (1, 2, 5, 12). What is happening?",
      memeCorrect: "https://media.giphy.com/media/2bYewTk7K2No1NvcuK/giphy.gif",
      memeWrong: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      options: [
        "The worker node ran out of disk space.",
        "The application container starts, immediately crashes (due to missing env var or unhandled exception), and Kubernetes is retrying with an exponential backoff delay.",
        "The Kubernetes cluster is overloaded and throttling your pod.",
        "The container image tag was misspelled."
      ],
      correctIndex: 1,
      explanation: "CrashLoopBackOff means the container started, but the process exited with an error code. K8s automatically restarts it, but adds an exponential delay (10s, 20s, 40s...) to prevent CPU exhaustion. Run `kubectl logs <pod> --previous` to see the exact crash stack trace!"
    },
    {
      id: 2,
      title: "The Mysterious 'Pending' Pod",
      scenario: "You apply a new deployment requesting `cpu: 4` and `memory: 16Gi`. The pod status stays stuck at `Pending` for 30 minutes without starting. What is the most probable cause?",
      memeCorrect: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      options: [
        "The Docker daemon crashed on all nodes.",
        "No single worker node in the cluster has 4 CPU cores and 16GB of unallocated memory available to satisfy the scheduler.",
        "The Pod YAML had a syntax error in metadata.",
        "Pending means the container is compiling its source code."
      ],
      correctIndex: 1,
      explanation: "Pending means the API server accepted the pod, but the `kube-scheduler` cannot find any worker node that satisfies the pod's resource requests. Run `kubectl describe pod <pod>` and look at Events for `0/3 nodes available: Insufficient cpu`!"
    },
    {
      id: 3,
      title: "The Ghost Service: Connection Timed Out",
      scenario: "Your Frontend pod tries to fetch data from `http://backend-service`. The request hangs and times out. You run `kubectl get svc backend-service` and see it has an IP. Why is it failing?",
      memeCorrect: "https://media.giphy.com/media/l4pMattUYTTM7qpIk/giphy.gif",
      memeWrong: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      options: [
        "The Service's `selector` label does not match the Pod's `labels`, so the Service has zero active backend Endpoints!",
        "Services only work on Tuesdays.",
        "Kubernetes CoreDNS requires 24 hours to propagate DNS records.",
        "You forgot to restart the Kubernetes API server."
      ],
      correctIndex: 0,
      explanation: "Services route traffic by matching labels. If your Service selector is `app: api` and your Pod has `app: my-api`, `kubectl get endpoints backend-service` will show `<none>`. No pods match, so traffic goes nowhere!"
    },
    {
      id: 4,
      title: "Liveness vs Readiness Probe Dilemma",
      scenario: "Your Java Spring Boot backend takes 45 seconds to initialize database connections on startup. During those 45 seconds, Kubernetes routes user HTTP traffic to it, causing 502 Bad Gateway errors. How do you solve this?",
      memeCorrect: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      memeWrong: "https://media.giphy.com/media/11StaZ9Lj75oCY/giphy.gif",
      options: [
        "Add a `readinessProbe` with an `initialDelaySeconds: 30`. Kubernetes will withhold traffic until the probe returns HTTP 200.",
        "Add an aggressive `livenessProbe` with `periodSeconds: 1` to restart it faster.",
        "Increase the worker node CPU to 64 cores.",
        "Switch from Kubernetes to a single Docker container."
      ],
      correctIndex: 0,
      explanation: "A ReadinessProbe controls whether a pod receives traffic from the Service. Adding a readiness probe ensures Kubernetes waits until the application is fully warmed up before adding its IP to the load balancer!"
    },
    {
      id: 5,
      title: "The 3 AM Production Rollback",
      scenario: "You deployed version `v2.4.0` 10 minutes ago, and customer complaints are flooding in because checkout buttons are failing. How do you immediately roll back to the previous stable release?",
      memeCorrect: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xThuW4BaAA2f7nRvoc/giphy.gif",
      options: [
        "`kubectl delete all --all`",
        "`kubectl rollout undo deployment/<deployment-name>`",
        "Re-clone the git repo and rebuild Docker images from scratch.",
        "Reboot the physical AWS EC2 instance."
      ],
      correctIndex: 1,
      explanation: "Kubernetes Deployments preserve ReplicaSet revision history! Running `kubectl rollout undo deployment/<name>` instantly resurrects the previous healthy ReplicaSet and terminates the buggy version with zero downtime!"
    }
  ],

  // Kubectl Command Generator Data
  commandBuilder: {
    run: {
      flags: [
        { id: "replicas", flag: "--replicas=3", name: "Replicas (--replicas=3)", desc: "Maintains 3 identical pod copies across worker nodes.", active: true },
        { id: "port", flag: "--port=80", name: "Container Port (--port=80)", desc: "Exposes port 80 on the container.", active: true },
        { id: "namespace", flag: "-n production", name: "Namespace (-n production)", desc: "Isolates workload into 'production' namespace.", active: false },
        { id: "dryrun", flag: "--dry-run=client -o yaml", name: "Generate YAML (--dry-run=client)", desc: "Outputs clean YAML manifest without creating resources on cluster.", active: false }
      ],
      target: "my-app"
    }
  }
};
