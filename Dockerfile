# --- Base Image ---
FROM node:20-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm && corepack prepare pnpm@9.0.6 --activate

WORKDIR /app

# --- Build Image ---
FROM base AS build
ARG NX_CLOUD_ACCESS_TOKEN

COPY .npmrc package.json pnpm-lock.yaml ./
COPY ./tools/prisma /app/tools/prisma
RUN pnpm install --frozen-lockfile

COPY . .

# Install @swc/helpers and build
RUN pnpm add @swc/helpers && pnpm run build

# --- Release Image ---
FROM base AS release

RUN apt update && apt install -y dumb-init --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy only necessary files for production
COPY --from=build /app/.npmrc /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/tools/prisma ./tools/prisma

# Install production dependencies and Prisma
RUN pnpm install --prod --frozen-lockfile && pnpm add prisma

# Generate Prisma client
RUN pnpm run prisma:generate

ENV TZ=UTC
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD [ "dumb-init", "pnpm", "run", "start" ]
