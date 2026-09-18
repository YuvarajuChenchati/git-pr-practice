# Lab 01: Layer Caching Experiment

### Objective
Witness Docker layer caching in action and understand why bad Dockerfile order causes massive rebuild slowdowns.

---

### The Experiment: Good Order vs Bad Order

#### Bad Order:
```dockerfile
# ❌ BAD ORDER:
FROM node:22-alpine
WORKDIR /app
COPY . .                  # <-- Copies all source files FIRST
RUN npm install           # <-- If any JS file changes, this runs from scratch every time!
CMD ["node", "server.js"]
```

#### Good Order:
```dockerfile
# ✅ GOOD ORDER:
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./     # <-- Copies ONLY dependency list
RUN npm install           # <-- Only re-runs when dependencies change!
COPY . .                  # <-- Code changes only invalidate this quick copy step
CMD ["node", "server.js"]
```

---

### Hands-on Test

1. Go into `01-docker-fundamentals/project-01-nodejs-api`.
2. Build the image:
   ```powershell
   docker build -t cache-test:v1 .
   ```
   Note the time it takes to run `npm install`.
3. Now, build it a second time without changing any files:
   ```powershell
   docker build -t cache-test:v1 .
   ```
   Notice how every single step prints `CACHED` and finishes in under **0.2 seconds**!
4. Open `server.js` and add a comment or change a word in the text.
5. Rebuild:
   ```powershell
   docker build -t cache-test:v1 .
   ```
   Notice that `RUN npm install` was **still CACHED**! Docker only invalidated the `COPY . .` step!
