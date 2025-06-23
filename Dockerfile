# syntax=docker/dockerfile:1

##############################
# Base image for all stages
##############################
FROM node:18-slim AS base

# Avoid prompts and keep builds clean
ENV DEBIAN_FRONTEND=noninteractive

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app


##############################
# Dependencies stage
##############################
FROM base AS deps

# Install dependencies based on lockfiles
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    else echo "No lockfile found." && exit 1; \
    fi


##############################
# Build stage
##############################
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate


# Build Next.js app
RUN npm run build


##############################
# Production runtime stage
##############################
FROM base AS runner

# Create non-root user with home dir (for npx/npm safety)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nextjs nextjs
ENV HOME=/home/nextjs

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# Copy built app and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema + generated client for runtime use
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Optional: copy package.json (e.g., if your app/server depends on it)
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
RUN apt-get update -y && apt-get install -y openssl postgresql-client && rm -rf /var/lib/apt/lists/*


COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

# Run app as non-root user
USER nextjs

EXPOSE 3000



# Start the app
CMD ["node", "server.js"]
