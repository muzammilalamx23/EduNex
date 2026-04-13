# EduNex: Advanced AI Learning Platform

EduNex is a production-grade learning management system (LMS) designed for modern technological education. It features a high-performance React frontend, a secure Express backend, and an atomic learning progress engine.

## 🚀 Key Features

- **Cyber-Neon UI**: High-contrast, accessibility-focused design system.
- **Persistent Progress**: Server-side tracking of lesson completion and learning position.
- **Admin Command Center**: Complete dashboard for course management and analytics.
- **Secure Auth**: JWT-based authentication with HttpOnly cookies.
- **Production DevOps**: Multi-stage Docker optimization and GitHub Actions CI/CD.

## 🛠️ Architecture Overview

### Frontend (Client)
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4.0 (Vanilla CSS @theme)
- **State**: React Context API (Auth) + React Router 7 (SPA Routing)
- **Animations**: Framer Motion + Three.js Shaders

### Backend (Server)
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB Atlas via Mongoose
- **Security**: Helmet, Rate Limiting, Mongo Sanitize
- **Logging**: Winston with MongoDB audit transport
- **Design Pattern**: Controller-Route Separation (MVC)

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas)
- Docker (Optional)

### 2. Installation
```bash
# Install root dependencies
npm install

# Install server and client dependencies
npm run build
```

### 3. Environment Setup
Create a `.env` file in the `server` directory (use `.env.example` as a template).

```bash
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=5000
```

### 4. Running Locally
```bash
# Run both frontend and backend concurrently
npm run dev
```

---

## 🐳 Docker Deployment

For a production-ready environment, use the provided multi-stage Dockerfile:

```bash
# Build the image
docker build -t edunex-platform .

# Run the container
docker run -p 5000:5000 --env-file server/.env edunex-platform
```

---

## 🧪 Testing and CI/CD

This project uses **GitHub Actions** for continuous integration. Every push to `main` triggers:
1. Linting and Static Analysis
2. Production Build Verification
3. Docker Image Assembly

---

## 🔐 Security Standards

- **HTTPOnly Cookies**: Tokens are never accessible via JavaScript (XSS Protection).
- **Rate Limiting**: Brute-force protection on authentication endpoints.
- **Sanitization**: Automatic NoSQL Injection shielding.
- **Non-Root Runtime**: Docker containers run as a dedicated `edunex` user.

---

## 📜 Documentation

- [API Specification](./server/routes/README.md)
- [Design System Spec](./cyber_neon_green_spec.md)
- [Engineering Audit](./engineering_audit.md)
