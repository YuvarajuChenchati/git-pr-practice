# 🩺 Module 07: Troubleshooting & Senior Interview Playbook

> *"Anyone can write a YAML file. A Senior DevOps engineer is measured by how quickly they debug a crashing cluster at 3 AM."*

---

## 🧰 The 4-Step Forensic Workflow

When a pod is red or failing, always execute this diagnosis order:

```
Step 1:  kubectl get pods -A                  ➔ Check general status (CrashLoopBackOff? Pending?)
Step 2:  kubectl describe pod <pod-name>       ➔ Inspect recent Events at the bottom of output
Step 3:  kubectl logs <pod-name> --previous    ➔ Inspect stdout/stderr right before it died
Step 4:  kubectl exec -it <pod-name> -- sh     ➔ Live interactive debugging inside the container
```

---

## 📚 Guides in this Module

1. **[The 5 Classic K8s Incidents Matrix](./troubleshooting-matrix.md)**
   - Detailed diagnosis and instant fixes for `CrashLoopBackOff`, `ImagePullBackOff`, `OOMKilled`, `Pending`, and `Empty Service Endpoints`.
2. **[Top 20 Senior Kubernetes Interview Q&A](./senior-interview-prep.md)**
   - Deep architectural questions covering etcd quorum, CNI networking, ingress controllers, rolling updates, and cluster security.
