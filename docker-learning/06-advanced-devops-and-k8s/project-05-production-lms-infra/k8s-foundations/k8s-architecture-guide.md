# ☸️ Kubernetes Architecture: Transitioning from Docker to K8s

### Why do companies move from Docker Compose to Kubernetes?

Docker Compose is fantastic for local development and single-server deployments (like an EC2 instance).
However, what happens when:
1. You have **100 servers** instead of 1?
2. A server physically catches fire at 3 AM?
3. Traffic spikes by 1,000% and you need 20 new container replicas in 10 seconds?
4. You want zero-downtime rolling upgrades where 1 container is replaced at a time?

This is where **Kubernetes (K8s)** takes over!

---

### How Kubernetes Runs Your Docker Containers

```
                                [Internet User]
                                       |
                           [Kubernetes Service / LB]
                                       |
               +-----------------------+-----------------------+
               |                       |                       |
        [Pod 1 (Docker)]        [Pod 2 (Docker)]        [Pod 3 (Docker)]
        Node App (Port 3000)    Node App (Port 3000)    Node App (Port 3000)
               |                       |                       |
        (Worker Node A)         (Worker Node B)         (Worker Node C)
```

1. **Pod**: The atomic unit in K8s. It wraps your Docker container with network and storage interfaces.
2. **Deployment**: Ensures your desired number of replicas (e.g. 3) are always running. If Worker Node B crashes, Kubernetes automatically recreates Pod 2 on Worker Node A or C!
3. **Service**: Acts as an internal round-robin load balancer, giving a single stable DNS name to reach any of the 3 pods.

---

### Commands Cheat Sheet (when using minikube or kubectl):
```bash
kubectl apply -f lms-api-deployment.yaml   # Deploy the 3 replicas
kubectl apply -f lms-api-service.yaml      # Create load balancer
kubectl get pods                           # View all running pods
kubectl get services                       # View external IP & port
kubectl scale deployment lms-api-deployment --replicas=5 # Scale to 5 replicas instantly!
```
