# ==============================================================================
# 🐳 Dockerfile: Blueprint for building our Node.js container image
# ==============================================================================

# 1. Base Image: Choose an official, lightweight Linux distribution with Node.js
#    - "alpine" is a tiny security-oriented Linux (~5MB base).
#    - "node:22-alpine" includes Node.js and npm pre-installed.
FROM node:22-alpine

# 2. Working Directory: Set the internal folder where commands will run
#    If the directory doesn't exist, Docker creates it automatically.
WORKDIR /app

# 3. Layer Caching Step 1: Copy only dependency manifests first
#    WHY? If you only change server.js, Docker REUSES the cached npm install layer!
#    This cuts build times from 40 seconds down to 0.1 seconds.
COPY package*.json ./

# 4. Install Dependencies
#    "npm install --omit=dev" or "npm ci" installs clean production dependencies
RUN npm install

# 5. Layer Caching Step 2: Copy the rest of your application code
#    Files matched in .dockerignore (like node_modules) will be skipped.
COPY . .

# 6. Expose Port (Documentation & Metadata)
#    Note: EXPOSE does NOT publish the port automatically! You still need "-p 3000:3000".
EXPOSE 3000

# 7. Default Environment Variables
ENV PORT=3000
ENV APP_ENV=production

# 8. Start Command: The process that runs as PID 1 inside the container
#    Always use the "exec" format with JSON array: ["executable", "param1", "param2"]
CMD ["node", "server.js"]
