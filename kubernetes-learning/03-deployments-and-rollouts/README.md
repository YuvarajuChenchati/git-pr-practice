# 🚀 Module 03: Deployments & Zero-Downtime Rolling Updates

> *"A junior developer deploys by taking down the server for 15 minutes at midnight.*  
> *A senior engineer deploys at 2 PM on a Tuesday without users noticing a single blip."*

---

## 🏗️ Why Deployments Rule Kubernetes

In Module 02, we met **ReplicaSets**, which ensure 3 pods are always alive.
**The Catch**: ReplicaSets do NOT know how to upgrade an application to a new version!
If you update the image tag on a ReplicaSet, it does nothing to the existing pods.

Enter the **Deployment**:
- A Deployment manages multiple ReplicaSets behind the scenes.
- It enables **Zero-Downtime Rolling Updates**:
  1. It creates a new ReplicaSet for `v2`.
  2. Spins up one `v2` pod. Once healthy, it shuts down one `v1` pod.
  3. Repeats until all pods are running `v2`.
  4. Keeps the old `v1` ReplicaSet alive at `0` replicas so you can **roll back instantly in 1 second**!

```
TIME ➔
Step 1:  [ v1 ]  [ v1 ]  [ v1 ]   (v1 ReplicaSet = 3, v2 ReplicaSet = 0)
Step 2:  [ v1 ]  [ v1 ]  [ v1 ]  [ v2 ]  <-- maxSurge spins up first v2 pod!
Step 3:  [ v1 ]  [ v1 ]  [ v2 ]  [ v2 ]  <-- One v1 pod terminated
Step 4:  [ v1 ]  [ v2 ]  [ v2 ]  [ v2 ]  <-- Second v1 pod terminated
Step 5:  [ v2 ]  [ v2 ]  [ v2 ]          <-- Zero dropped HTTP requests! Complete!
```

---

## ⚡ The Mathematics of Rolling Updates: `maxSurge` & `maxUnavailable`

In your deployment YAML:
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%         # How many extra pods K8s can create above replicas
    maxUnavailable: 25%   # How many pods can be taken offline during the update
```
- **maxSurge**: Ensures you never run out of capacity during heavy traffic.
- **maxUnavailable**: Prevents too many pods from shutting down simultaneously.

---

## 🧪 Real Hands-on Terminal Walkthrough

### Step 1: Deploy Version 1
```bash
kubectl apply -f deployment-v1.yaml
kubectl get deployments
kubectl get pods -l app=ecommerce-web
```

### Step 2: Trigger the Rolling Update to Version 2
```bash
kubectl apply -f deployment-v2.yaml

# Watch the live rolling update in real time:
kubectl rollout status deployment/ecommerce-web
```

### Step 3: View Revision History
```bash
kubectl rollout history deployment/ecommerce-web
```
Output:
```text
REVISION  CHANGE-CAUSE
1         Initial production release v1
2         Upgraded to security release v2
```

### Step 4: The 3 AM Disaster Rollback (Undo!)
Suppose `v2` had a critical bug that escaped staging.
How do you roll back to `v1`?
```bash
# ONE COMMAND RESCUE:
kubectl rollout undo deployment/ecommerce-web
```
Kubernetes instantly revives the previous ReplicaSet and rolls back to `v1`!
No rebuilding Docker images, no git reverts required under pressure.
