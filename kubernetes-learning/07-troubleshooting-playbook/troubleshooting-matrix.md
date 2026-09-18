# 🚨 The 5 Classic Kubernetes Production Incidents

| Incident | Symptom in `kubectl get pods` | Root Cause | Instant Fix Command |
|---|---|---|---|
| **1. CrashLoopBackOff** | Container starts, crashes, K8s waits with exponential backoff. | Missing env variable, unhandled runtime exception, database unreachable. | `kubectl logs <pod> --previous` to see crash trace. Fix code or config. |
| **2. ImagePullBackOff / ErrImagePull** | Pod stuck trying to download container image. | Typo in image name, non-existent tag, or private registry credentials missing. | Check tag spelling. If private ECR/DockerHub, add `imagePullSecrets`. |
| **3. OOMKilled (Exit Code 137)** | Pod suddenly terminates during peak traffic; restarts count increases. | Memory leak or container exceeded `resources.limits.memory`. | `kubectl describe pod <pod>` shows `OOMKilled: true`. Increase memory limit. |
| **4. Pending** | Pod created but never starts running; stays `Pending` indefinitely. | No worker node has enough free CPU/RAM, or `nodeSelector` / PVC mount failed. | `kubectl describe pod <pod>` ➔ check Events for `0/3 nodes available: Insufficient cpu`. Scale up nodes or decrease requests. |
| **5. Service Connection Timeout** | Service IP exists, but requests hang or return 503. | Service `selector` does not match the Pod `labels`, so Endpoints list is empty! | Run `kubectl get endpoints <svc-name>`. If `<none>`, fix the label selector! |

---

### Incident Case Study: The "Empty Endpoints" Trap
A junior engineer created this Deployment and Service:
```yaml
# Deployment:
metadata:
  labels:
    app: payment-api
# ...
# Service:
spec:
  selector:
    app: payment_api # <-- TYPO! Underscore instead of hyphen!
```
- The Service was created cleanly with no errors.
- But running `kubectl get endpoints my-service` returned `<none>`.
- Kubernetes could not find any pods matching `app: payment_api`.
- **Lesson**: Services link to Pods exclusively through string matching on labels. Always check `kubectl get endpoints <svc-name>` first!
