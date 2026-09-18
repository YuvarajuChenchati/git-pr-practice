# 🧩 Challenge: 3 Broken Dockerfiles (Can You Spot the Bugs?)

Put your skills to the test! Below are 3 real Dockerfiles with common production bugs.
Try to find the error before scrolling down to the solution!

---

### Challenge 1: The "Why Can't I Connect?" Mystery

```dockerfile
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```
*App code:*
```javascript
const express = require('express');
const app = express();
app.listen(8080, '127.0.0.1'); // <-- Hint!
```
*Execution command:*
```bash
docker run -d -p 8080:8080 my-app
```
**Symptom**: The container is running, but opening `http://localhost:8080` gives "Connection Refused".

<details>
<summary>🔍 Click to Reveal Answer & Fix</summary>

**The Bug**:
The server is listening on `127.0.0.1` (localhost inside the container).
Inside Docker, `127.0.0.1` refers **only** to the loopback adapter inside that isolated container namespace. External traffic coming through Docker's bridge network cannot reach it!

**The Fix**:
Change `127.0.0.1` to `0.0.0.0` (all network interfaces):
```javascript
app.listen(8080, '0.0.0.0');
```
</details>

---

### Challenge 2: The "Why is My Build 15 Minutes Every Time?"

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```
**Symptom**: Whenever a developer fixes a typo in a markdown file or comment in `server.js`, Docker rebuilds the entire `npm install` from scratch, taking 3-5 minutes.

<details>
<summary>🔍 Click to Reveal Answer & Fix</summary>

**The Bug**:
Bad layer ordering!
By doing `COPY . .` before `RUN npm install`, ANY change to any file in your project directory invalidates the build cache for that layer and all subsequent layers!

**The Fix**:
Split the copies:
```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```
Now `npm install` is cached forever until `package.json` actually changes!
</details>

---

### Challenge 3: The Broken Alpine Binary

```dockerfile
FROM alpine:3.20
WORKDIR /app
COPY ./my-compiled-go-binary ./app
CMD ["./app"]
```
**Symptom**: Container crashes immediately with:
`standard_init_linux.go: exec user process caused: no such file or directory`
Even though the file definitely exists!

<details>
<summary>🔍 Click to Reveal Answer & Fix</summary>

**The Bug**:
The binary was dynamically compiled against `glibc` (standard GNU C Library used by Ubuntu/Debian).
Alpine Linux uses `musl libc`, so the dynamic linker `/lib/ld-linux-x86-64.so.2` doesn't exist on Alpine!

**The Fix**:
Either:
1. Compile Go with `CGO_ENABLED=0` (statically linked binary).
2. Or use `debian:bookworm-slim` or `node:22-slim` as the base image instead of Alpine.
</details>
