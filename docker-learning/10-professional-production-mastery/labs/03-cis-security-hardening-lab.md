# 🛡️ Lab 03: CIS Benchmark Security Hardening & Read-Only Containers

> **The Story:**  
> A popular open-source e-commerce platform had a zero-day Remote Code Execution (RCE) vulnerability in an image-upload plugin.  
> Attackers discovered an endpoint that allowed them to upload and execute arbitrary shell commands inside the container.  
> - **Company A** ran their container as default `root` with a writable filesystem. The attacker downloaded a cryptominer into `/tmp`, modified the system binaries, and escalated privileges to compromise the host server.  
> - **Company B** implemented CIS Docker Hardening (non-root user, read-only rootfs, and dropped Linux capabilities). When the exploit script ran, it tried to write to disk:  
> `sh: /tmp/miner: Read-only file system`  
> It tried to run privileged system calls:  
> `Operation not permitted`  
> The exploit completely failed. Company B survived without losing a single dollar or credential.

---

## 🎯 Learning Objectives
1. Experience the danger of running containers as default `root`.
2. Enforce unprivileged user execution (`--user 10001`).
3. Lock down container storage using Read-Only root filesystems (`--read-only`).
4. Drop all Linux kernel capabilities (`--cap-drop=ALL`) to achieve true defense-in-depth.

---

## 🧪 Step-by-Step Practical Lab

### Phase 1: The Vulnerable Container (The Default Trap)

1. Run an unhardened container:
   ```powershell
   docker run --rm -it alpine sh
   ```

2. Inside the container, check who you are:
   ```sh
   whoami
   id
   ```
   *Output:*
   ```text
   root
   uid=0(root) gid=0(root) groups=0(root)
   ```
   🚨 **You are ROOT.** If a flaw exists in your software, attackers possess root privileges inside the container!

3. Exit the container:
   ```sh
   exit
   ```

---

### Phase 2: Defense Pillar 1 — Enforce Non-Root Execution

1. Run a container explicitly mapped to an unprivileged UID (e.g. `10001`):
   ```powershell
   docker run --rm -it --user 10001:10001 alpine sh
   ```

2. Check identity:
   ```sh
   id
   ```
   *Output:*
   ```text
   uid=10001 gid=10001
   ```

3. Try installing a package or modifying system files:
   ```sh
   apk add curl
   ```
   *Output:*
   ```text
   ERROR: Unable to lock database: Permission denied
   ```
   🎉 Attackers cannot install tools, packages, or modify system binaries!

4. Exit:
   ```sh
   exit
   ```

---

### Phase 3: Defense Pillar 2 — Read-Only Root Filesystem (`--read-only`)

Most applications only need to read code files; they never need to modify system directories or write new executable files to disk.

1. Launch a container with its entire root filesystem locked as read-only:
   ```powershell
   docker run --rm -it --read-only alpine sh
   ```

2. Try to download or create a malicious script anywhere in the filesystem:
   ```sh
   echo "malicious_payload" > /tmp/hack.sh
   ```
   *Output:*
   ```text
   sh: can't create /tmp/hack.sh: Read-only file system
   ```
   Even if an attacker gains shell execution, they cannot drop scripts, download binaries, or persist any artifacts on disk!

3. *Wait—what if my app needs to write temporary cache files?*  
   Use an **in-memory `tmpfs` mount** specifically for `/tmp`:
   ```powershell
   docker run --rm -it `
     --read-only `
     --tmpfs /tmp:rw,noexec,nosuid,size=64m `
     alpine sh
   ```
   Now `/tmp` is in volatile RAM with `noexec` (cannot execute scripts from `/tmp`) and auto-wiped on exit!

4. Exit:
   ```sh
   exit
   ```

---

### Phase 4: Defense Pillar 3 — Drop Linux Kernel Capabilities (`--cap-drop`)

The Linux kernel has over 40 granular capabilities. By default, Docker grants 14 of them (such as `CHOWN`, `SETUID`, `NET_RAW`).

1. Inspect default capabilities on a normal container:
   ```powershell
   docker run --rm alpine capsh --print
   ```

2. Run with **ALL capabilities revoked**:
   ```powershell
   docker run --rm --cap-drop=ALL alpine capsh --print
   ```
   *Output:*
   ```text
   Current: =
   ```
   Zero capabilities granted! The container is completely stripped of system call privileges.

---

### 🏆 The CIS Gold Standard Docker Compose Configuration

In real production, combine all these layers into your service definition:

```yaml
version: '3.8'

services:
  secure-api:
    image: my-production-api:v1.0
    # 1. Run as unprivileged user
    user: "10001:10001"
    
    # 2. Prevent privilege escalation
    security_opt:
      - no-new-privileges:true
      
    # 3. Read-only root filesystem
    read_only: true
    
    # 4. Volatile in-memory temporary scratchpad
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
      
    # 5. Drop all Linux capabilities, add back only networking if needed
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```
You now have a fortress-grade container that meets the strictest financial, healthcare, and enterprise compliance standards (PCI-DSS, SOC 2, HIPAA, and CIS Docker Benchmark)!
