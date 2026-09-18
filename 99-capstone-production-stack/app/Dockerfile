# ==============================================================================
# Multi-Stage Production Dockerfile for DevOps Capstone App
# ==============================================================================

# STAGE 1: Dependency Builder
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# STAGE 2: Minimal Distroless / Hardened Runner
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set non-root production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init / tini for PID 1 signal handling
RUN apk add --no-cache dumb-init

# Copy minimal production dependencies and app code
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node server.js ./

# Switch to unprivileged user
USER node

# Expose microservice port
EXPOSE 3000

# Healthcheck for Docker engine
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/healthz || exit 1

# Execute with PID 1 init process
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
