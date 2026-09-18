# 🔐 Module 05: ConfigMaps, Secrets & Persistent Storage (PVC)

> *"Never hardcode an API key or DB password in a Dockerfile.*  
> *Git history never forgets, and automated bots scan GitHub 24/7."*

---

## 🧩 The Separation of Concerns

A golden rule of Twelve-Factor Applications is:
> **Store configuration in the environment, not in the code.**

In Kubernetes:
1. **ConfigMaps**: Plaintext configuration (port numbers, feature flags, API URLs).
2. **Secrets**: Sensitive data (database passwords, TLS certificates, OAuth tokens).
3. **PersistentVolumeClaims (PVC)**: Hard disk requests for stateful databases (PostgreSQL, MySQL, MongoDB).

```
                            KUBERNETES SECRETS & STORAGE
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
  ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
  │    ConfigMap    │          │     Secret      │          │       PVC       │
  │ (APP_ENV, PORT) │          │ (DB_PASS, KEYS) │          │ (Cloud EBS/NFS) │
  └────────┬────────┘          └────────┬────────┘          └────────┬────────┘
           │                            │                            │
           └──────────────────┬─────────┴────────────────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Your Pod       │
                     │  (Node.js / Go)  │
                     └──────────────────┘
```

---

## ⚓ The Storage Hierarchy: PV vs PVC

Think of Storage in Kubernetes like renting an apartment:
- **PersistentVolume (PV)**: The physical apartment building (an AWS EBS volume, a local SSD, or an NFS share). Provisioned by the cloud administrator.
- **PersistentVolumeClaim (PVC)**: The tenant's lease request: *"I need 10 Gigabytes of storage with ReadWriteOnce access!"*
- Kubernetes acts as the broker: it matches the PVC to a suitable PV and mounts it directly into your Pod at `/var/lib/postgresql/data`.

If the PostgreSQL pod crashes or gets rescheduled to a different physical node, Kubernetes **detaches the volume from the old node and reattaches it to the new node**. Zero data loss!

---

## 🧪 Hands-On Manifests

### 1. Test ConfigMaps & Secrets Injection
Open [`configmap-secrets.yaml`](./configmap-secrets.yaml):
```bash
kubectl apply -f configmap-secrets.yaml
kubectl get configmaps
kubectl get secrets

# Verify injected environment variables inside the pod:
kubectl exec -it env-test-pod -- env | grep APP_
```

### 2. Run Stateful PostgreSQL with Persistent Storage
Open [`postgres-pvc.yaml`](./postgres-pvc.yaml):
```bash
kubectl apply -f postgres-pvc.yaml
kubectl get pvc
kubectl get pods -l app=postgres-db
```
Even if you run `kubectl delete pod -l app=postgres-db`, the newly resurrected pod reconnects to the existing PVC and keeps all your tables intact!
