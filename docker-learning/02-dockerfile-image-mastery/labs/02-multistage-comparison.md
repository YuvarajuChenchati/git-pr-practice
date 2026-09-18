# Lab 02: Multi-Stage Builds Comparison

### Objective
Learn how multi-stage builds eliminate compiler toolchains, dev dependencies, and temporary build caches from the final production container.

---

### Single-Stage vs Multi-Stage Concept

```
SINGLE-STAGE BUILD (Heavy):
+--------------------------------------------------------------+
| Base Image (Node.js + Linux OS)               ~ 180 MB       |
| + Build Tools (python, make, gcc, git)        ~ 250 MB       |
| + All DevDependencies (TypeScript, Linters)   ~ 400 MB       |
| + Temporary build caches                      ~ 200 MB       |
| + Final compiled JS code                      ~ 5 MB         |
| = Total Production Image Size:                ~ 1.05 GB ❌   |
+--------------------------------------------------------------+

MULTI-STAGE BUILD (Optimized):
Stage 1: BUILDER (Disposed after build finishes)
  Installs build tools, compiles TS/bundles, runs tests.

Stage 2: RUNNER (Final image pushed to AWS / Production)
  + Clean Alpine Base                            ~ 40 MB
  + Production-only node_modules                 ~ 20 MB
  + Compiled code only                           ~ 5 MB
  = Total Production Image Size:                 ~ 65 MB ✅
```

---

### Real Comparison Table

| Metric | Single-Stage Image | Multi-Stage Image | Benefit |
|---|---|---|---|
| **Image Size** | ~1.1 GB | ~65 MB | **94% smaller** |
| **Download Time on AWS** | ~45 seconds | ~2 seconds | **Instant deployment** |
| **Attack Surface** | High (has bash, compilers, git) | Minimal (only runtime) | **High Security** |
| **Memory footprint** | Higher | Lower | **Cost savings** |
