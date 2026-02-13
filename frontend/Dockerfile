# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve
FROM node:22-alpine

WORKDIR /app

# Copy built artifacts from 'builder' stage
# Adjust the source path 'dist/miturnoapp' if your angular.json output path is different
COPY --from=builder /app/dist/miturnoapp ./dist/miturnoapp

# Copy unnecessary files for running the server (if any) or just the built output
# For Angular SSR, we usually need the server/ folder and browser/ folder which are inside dist/miturnoapp

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Command to run the server
CMD ["node", "dist/miturnoapp/server/server.mjs"]
