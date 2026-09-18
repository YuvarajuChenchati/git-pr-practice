# 🎯 Top 20 Senior Kubernetes / Cloud Platform Interview Q&A

### Q1: What is the difference between an Image, a Container, a Pod, and a Deployment?
**Answer**:
- **Image**: An immutable, read-only package containing code, binaries, libraries, and runtime.
- **Container**: An isolated running process created from an image, confined by Linux namespaces and cgroups.
- **Pod**: The smallest deployable unit in Kubernetes; encapsulates one or more containers that share network namespace (`localhost`), storage volumes, and IP.
- **Deployment**: A high-level declarative controller that manages ReplicaSets, enabling auto-healing, scaling, and zero-downtime rolling updates.

---

### Q2: How does Kubernetes handle a worker node physical failure?
**Answer**:
1. Every worker node's `kubelet` sends regular heartbeats (node status updates) to the `kube-apiserver`.
2. If a node fails to report within `node-monitor-grace-period` (default 40s), the **Node Controller** marks the node as `NotReady`.
3. If the node remains unreachable for `pod-eviction-timeout` (default 5m), the Controller Manager evicts the pods from that node.
4. The **kube-scheduler** detects the missing replicas and reschedules replacement pods onto other healthy worker nodes in the cluster.

---

### Q3: What is the role of `etcd` in the control plane, and why must it have an odd number of members?
**Answer**:
`etcd` is a distributed, consistent, key-value store using the **Raft consensus algorithm**. It stores the complete desired and current state of the entire cluster.
An odd number of nodes (3, 5, or 7) is required to establish a **quorum** ($Q = \lfloor N/2 \rfloor + 1$).
- A 3-node cluster can tolerate 1 failure ($3/2 + 1 = 2$).
- A 4-node cluster can also only tolerate 1 failure ($4/2 + 1 = 3$), but adds extra network latency without increasing fault tolerance! Hence, etcd clusters always run with odd node counts.

---

### Q4: Explain the difference between `LivenessProbe` and `ReadinessProbe`.
**Answer**:
- **ReadinessProbe**: Determines if the container is ready to accept user network traffic. If it fails, Kubernetes removes the pod IP from the Service Endpoints so no requests are sent to it. The container is **not** killed.
- **LivenessProbe**: Determines if the container is still running properly or stuck in a deadlock/infinite loop. If it fails, `kubelet` **kills the container and restarts it**.

---

### Q5: What is the difference between `ClusterIP`, `NodePort`, and `LoadBalancer` services?
**Answer**:
- **ClusterIP**: Exposes the service on an internal-only cluster IP. Accessible only by other pods inside the cluster.
- **NodePort**: Allocates a port across the range `30000-32767` on every node's external IP address.
- **LoadBalancer**: Requests the underlying cloud provider (AWS, GCP, Azure) to provision an external cloud load balancer (such as an AWS NLB or ALB) pointing to the NodePorts.

---

### Q6: How does Kubernetes achieve zero-downtime rolling updates?
**Answer**:
Through the Deployment controller using `RollingUpdate` strategy with parameters:
- `maxSurge`: Maximum number of extra pods that can be created above the desired replica count.
- `maxUnavailable`: Maximum number of pods that can be unavailable during the update.
K8s creates a new ReplicaSet for version 2, starts a `v2` pod, waits for its `ReadinessProbe` to succeed, routes traffic to it, and then terminates a `v1` pod. This repeats progressively until all pods are running `v2`.

---

### Q7: What is an Ingress Controller, and how does it differ from a Service?
**Answer**:
A Service operates primarily at Layer 4 (TCP/UDP transport level).
An **Ingress Controller** (such as Ingress-Nginx, Traefik, or AWS ALB Controller) operates at Layer 7 (HTTP/HTTPS application level). It provides host-based routing (`api.example.com`), path-based routing (`/checkout` vs `/search`), TLS/SSL termination, and rate limiting into a single public IP.

---

### Q8: What happens when a container exceeds its memory limit? What about CPU limit?
**Answer**:
- **Memory**: Memory is a non-compressible resource. If a container exceeds its `limits.memory`, the Linux kernel OOM (Out Of Memory) killer sends `SIGKILL` (Exit Code 137).
- **CPU**: CPU is a compressible resource. If a container exceeds its `limits.cpu`, it is **throttled** (given fewer CPU clock cycles via CFS - Completely Fair Scheduler quotas). It will run slower, but it will **not** be killed.

---

### Q9: What is CoreDNS, and how does service discovery work inside Kubernetes?
**Answer**:
CoreDNS is the cluster's internal DNS server. Every Service created automatically gets a DNS record:
`<service-name>.<namespace>.svc.cluster.local`.
When a container queries `http://backend-service:8080`, the container's `/etc/resolv.conf` routes the query to CoreDNS (usually `10.96.0.10`), which resolves the service name to its virtual ClusterIP.

---

### Q10: What is the difference between a PersistentVolume (PV) and a PersistentVolumeClaim (PVC)?
**Answer**:
- **PersistentVolume (PV)**: A piece of physical storage provisioned by a cloud admin or storage class (e.g. AWS EBS volume).
- **PersistentVolumeClaim (PVC)**: A request for storage by a user/developer specifying required size and access mode (e.g., 10Gi, `ReadWriteOnce`).
The PVC binds to a matching PV, which can then be mounted into a Pod.
