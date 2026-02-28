# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Build stage
FROM base AS build
RUN npm ci
COPY . .

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app .
RUN npm install -g pm2
EXPOSE 5000
CMD ["pm2-runtime", "index.js"]
