# EduNex - Enterprise MERN EdTech Platform

EduNex is a high-performance, modular monolithic, gamified EdTech platform built to enterprise standards. Inspired by top-tier platforms like Duolingo, Codecademy, and LeetCode, EduNex delivers an ultra-smooth React interface powered by a deeply hardened, secure Express backend.

## 🚀 Features
- **Gamified Learning**: Live XP, daily streaks, dynamic leaderboards, and mission unlock mechanics.
- **Distributed Playground Engine**: Write and execute real Node.js and Python code directly in the browser. Powered by BullMQ, Redis, Docker, and Socket.IO for safe, isolated execution and live log streaming.
- **Enterprise Security**: XSS protection, MongoDB query sanitization, Rate Limiting, HTTP-only JWTs, RBAC (Role-Based Access Control), and anti-XP farming logic.
- **Premium UI**: Framer Motion animations, dark mode SaaS aesthetics, and glassmorphic micro-interactions. Fully responsive down to 320px.
- **Optimized Performance**: TanStack Query for cache invalidation, Zustand for lightweight state management, and Mongoose lean aggregations to defeat N+1 query overhead.

## 🛠 Tech Stack

### Frontend
- **React 18 & Vite** (Lazy loading, Suspense, Error Boundaries)
- **Tailwind CSS** (Mobile-first responsive design)
- **Framer Motion** (Fluid layout animations)
- **Zustand & TanStack Query** (State & Cache management)
- **Socket.IO Client** (Real-time execution streaming)
- **Monaco Editor** (In-browser code authoring)

### Backend
- **Node.js & Express.js** (Modular Monolithic Architecture)
- **MongoDB & Mongoose** (Optimized schemas, indexing)
- **Redis & BullMQ** (Scalable asynchronous job processing)
- **Socket.IO** (Bi-directional real-time events)
- **Docker** (Isolated code execution sandboxing)
- **JWT & bcrypt** (Stateless authentication)

## 📦 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Redis (Local or Cloud instance like Upstash)
- Docker Desktop (Required for Playground Engine to run code)

### 1. Clone & Install
```bash
git clone https://github.com/muzammilalamx23/EduNex.git
cd EduNex
npm install

cd client && npm install
cd ../server && npm install
```

### 2. Environment Variables
Create a `.env` file inside the `server/` directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@cluster.mongodb.net/edunex?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Redis Queue (Required for BullMQ)
REDIS_URI=redis://default:<password>@<host>:<port>

# Frontend
CORS_ORIGIN=http://localhost:5173
```

### 3. Run the Development Server
From the root of the project:
```bash
npm run dev
```
- Frontend will boot on `http://localhost:5173`
- Backend API will boot on `http://localhost:5000`

> **Note:** If Redis is offline, the backend will intelligently fallback to synchronous code execution via the Node event loop.

## 🔐 Deployment (Production Readiness)
EduNex is architected for immediate zero-config deployment.

1. **Frontend (Vercel):** Connect your GitHub repo to Vercel and point the Root Directory to `client/`. Add `VITE_API_URL` to Vercel Env variables.
2. **Backend (Render/Railway):** Connect your GitHub repo, set the Root Directory to `server/`, and add your MongoDB and Redis credentials.
3. **Database (MongoDB Atlas):** Scale up clusters as needed. Add the backend IPs to your Atlas allowlist.
4. **Redis (Upstash):** Provision a free Redis serverless database for BullMQ queue management.

## 🔒 Security Posture
- All user inputs are sanitized against NoSQL injection via `express-mongo-sanitize`.
- API endpoints are heavily rate-limited (`express-rate-limit`) to prevent DDoS attacks.
- Playgrounds prevent arbitrary host execution by encapsulating scripts in strictly limited, network-isolated Docker containers with enforced 5-second timeouts.
- Strict anti-cheating mechanisms (`ProgressService.awardMissionXP`) prevent users from duplicate-submitting playground missions to farm XP.

## 📜 License
MIT License - Use it, build on it, learn from it.
