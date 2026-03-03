# Stage 1: Build the frontend
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build the backend and assemble the final image
FROM node:20-alpine
WORKDIR /app

# Create server directory and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server source code
COPY server/ ./server/

# Move the built frontend to where the server expects it
# Based on your server/index.js, it looks for ../client/dist
COPY --from=client-build /app/client/dist ./client/dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server/index.js"]
