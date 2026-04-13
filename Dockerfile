# Stage 1: Build the frontend
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build the backend and assemble the final image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -S edunex && adduser -S edunex -G edunex

# Install production dependencies for server
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Move the built frontend
COPY --from=client-build /app/client/dist ./client/dist

# Ensure the logs directory exists and is writable by our user
RUN mkdir -p server/logs && chown -R edunex:edunex /app

# Switch to the non-root user
USER edunex

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["node", "server/index.js"]
