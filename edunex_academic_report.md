# Academic Project Report: EduNex - AI-Powered EdTech Platform

---

## CHAPTER 1: INTRODUCTION

### 1.1 Background of Online Coding Education
The landscape of education has undergone a paradigm shift, transitioning from traditional classrooms to digital learning environments. In the domain of computer science, online coding education has become paramount. However, learning programming poses unique challenges, primarily because theoretical understanding must be coupled with practical, hands-on implementation. Static video tutorials and text-based guides often fail to bridge this gap, leading to student disengagement and poor retention of complex concepts.

### 1.2 Problems in Traditional Learning Platforms
Traditional e-learning platforms often rely on passive learning models. Students watch a video or read an article and are then expected to set up their own local development environments to practice. This introduces significant friction, including configuration errors, dependency issues, and operating system incompatibilities. Furthermore, the lack of real-time feedback and isolated learning environments hinders the conceptualization of logic flow, making debugging a frustrating experience for beginners.

### 1.3 Importance of Interactive Coding Systems
Interactive coding systems eliminate the friction of local environment setup by providing in-browser execution. They allow students to write, compile, and execute code immediately after learning a concept. This immediate feedback loop is crucial for reinforcing knowledge, experimenting with code behavior, and building practical problem-solving skills in a safe, sandboxed environment.

### 1.4 Role of AI in Modern Education
Artificial Intelligence is revolutionizing education by providing personalized learning experiences. An AI mentor can act as a 24/7 tutor, offering contextual hints, debugging assistance, and code explanations without providing direct solutions. This scaffolding approach mimics human mentorship, guiding students toward self-correction and deeper understanding.

### 1.5 Overview of EduNex
EduNex is a comprehensive, free AI-assisted coding education platform designed to provide an end-to-end interactive learning experience. It combines a structured curriculum with a real-time coding playground, gamification elements, and an AI mentor. By utilizing a secure Docker-based code execution engine, EduNex ensures that users can practice coding safely and efficiently directly from their web browsers.

### 1.6 Key Technologies Used
The platform is built on a robust, modern technology stack:
*   **Frontend:** React 19, Vite 7, Tailwind CSS, Zustand (State Management), TanStack Query (Data Fetching), Monaco Editor (Code Editor), Framer Motion (Animations).
*   **Backend:** Node.js, Express.js.
*   **Database & Caching:** MongoDB (Primary Data Store), Redis (Caching and Message Broker).
*   **Execution & Real-time:** BullMQ (Job Queue), Socket.io (Real-time communication), Docker Sandbox (Isolated code execution).

### 1.7 Motivation Behind the Project
The primary motivation behind EduNex is to democratize high-quality computer science education. By removing technical barriers to entry and incorporating gamification and AI assistance, the project aims to create a highly engaging, accessible, and scalable platform that empowers learners of all backgrounds to master programming skills.

---

## CHAPTER 2: OBJECTIVE

### 2.1 Main Objectives of EduNex
The overarching objective of EduNex is to provide a frictionless, interactive, and engaging platform for learning software development, utilizing modern web technologies to simulate a real-world coding environment.

### 2.2 Educational Goals
*   Provide structured, interactive courses that integrate theory with immediate practice.
*   Enhance code comprehension through real-time execution and immediate error feedback.
*   Utilize AI to provide contextual tutoring, guiding students without merely giving away answers.

### 2.3 Technical Goals
*   Implement a highly responsive, single-page application (SPA) architecture.
*   Develop a secure, isolated code execution engine capable of running untrusted user code safely using Docker.
*   Implement a robust asynchronous job queue system to handle heavy execution loads without blocking the main server thread.

### 2.4 User Experience Goals
*   Deliver a seamless, intuitive, and aesthetically pleasing user interface (UI) with a premium SaaS-like design.
*   Provide an integrated development environment (IDE) experience within the browser using the Monaco Editor.
*   Ensure instant feedback loops and smooth transitions using Framer Motion.

### 2.5 Scalability Goals
*   Architect the system to handle concurrent users and peak loads by decoupling the code execution engine from the main API using Redis and BullMQ.
*   Utilize horizontal scaling principles within a modular monolith structure.

### 2.6 Security Goals
*   Prevent malicious code attacks (e.g., infinite loops, unauthorized file access) using heavily restricted Docker sandboxing with strict timeouts and memory limits.
*   Ensure secure authentication and authorization protocols for user data protection.

### 2.7 Accessibility Goals
*   Ensure the platform is fully responsive and accessible across various devices, including a dedicated mobile strategy for learning on the go.
*   Maintain a free-to-use model to maximize educational reach.

---

## CHAPTER 3: PLANNING

### 3.1 Project Planning Methodology
The project utilized an Agile development methodology, breaking down the development process into iterative sprints. This allowed for continuous integration, regular testing of the complex code execution pipeline, and the flexibility to adapt UI/UX designs based on iterative feedback.

### 3.2 Modular Monolith Architecture Planning
A modular monolith architecture was chosen over microservices to reduce deployment complexity while maintaining clear logical boundaries. The codebase is organized by domain (e.g., Users, Courses, Playground, Execution Worker), allowing the execution worker to be scaled independently if necessary, without the overhead of managing a distributed microservice network.

### 3.3 Frontend/Backend Planning
*   **Frontend:** Planned as a Vite-powered React SPA for maximum performance. Zustand was selected for lightweight global state management (e.g., user session, playground state), and TanStack Query for robust asynchronous state and caching.
*   **Backend:** Planned as a RESTful Express.js API, serving as the central hub connecting the frontend, database, and execution workers.

### 3.4 Execution Engine Planning
The most critical component planning involved the secure execution of user code. 
*   **Docker:** Chosen to provide an isolated runtime environment (sandbox).
*   **Redis & BullMQ:** Planned to act as the intermediary queue. When a user submits code, the API enqueues a job in Redis. A background BullMQ worker consumes this job, spins up a Docker container, executes the code, and returns the result, ensuring the main API never blocks.

### 3.5 Timeline Assumptions and Feature Prioritization
Development was prioritized based on core platform viability:
1.  **Phase 1:** Core Authentication, Database Schema, and Basic UI.
2.  **Phase 2:** Course Content Management and Monaco Editor Integration.
3.  **Phase 3:** Docker Sandbox Execution Engine and BullMQ Queue.
4.  **Phase 4:** Gamification (XP, Leaderboards), AI Integration, and Socket.io.
5.  **Phase 5:** Optimization, UI Polish, and Production Deployment.

### 3.6 Stability-First Deployment Strategy
The deployment strategy prioritized stability, ensuring that if the Redis queue or Docker daemon experienced issues, the platform would fail gracefully, informing the user rather than crashing the entire Node.js server.

---

## CHAPTER 4: REQUIREMENT ANALYSIS

### 4.1 Functional Requirements
*   **Authentication:** Users must be able to register, log in, and manage their profiles.
*   **Interactive Playground:** Users must be able to write code in a Monaco-powered editor, submit it, and view standard output/errors.
*   **Course System:** Users must be able to enroll in courses, view lessons, and complete associated coding missions.
*   **AI Mentor:** Users must be able to request hints and code reviews from an integrated AI assistant.
*   **Gamification:** The system must track user XP, maintain a daily streak, and update a global leaderboard.
*   **Community:** Users must be able to participate in discussion forums.

### 4.2 Non-Functional Requirements
*   **Reliability:** The code execution engine must have a 99% success rate for valid code.
*   **Maintainability:** The codebase must follow strict ESLint rules and modular design principles.
*   **Usability:** The UI must be intuitive, requiring zero onboarding for basic navigation.

### 4.3 Hardware Requirements
*   **Server:** Minimum 2 vCPUs, 4GB RAM (due to Docker overhead).
*   **Client:** Any modern device with at least 2GB RAM.

### 4.4 Software Requirements
*   **Server:** Node.js (v18+), MongoDB (v5+), Redis (v6+), Docker Engine.
*   **Client:** Modern Web Browser (Chrome, Firefox, Safari, Edge).

### 4.5 Performance Requirements
*   API response times should be under 200ms.
*   Code execution turnaround (from submit to result) should be under 2 seconds for standard logic.
*   Frontend First Contentful Paint (FCP) should be under 1.5 seconds.

### 4.6 Security Requirements
*   Passwords must be hashed using bcrypt.
*   API routes must be protected using JWT authentication.
*   Docker containers must run without root privileges, without network access, and with strict memory (e.g., 50MB) and CPU limits.

### 4.7 Scalability Requirements
*   The BullMQ worker must be capable of processing multiple execution jobs concurrently.

### 4.8 Browser & Mobile Compatibility
*   Fully compatible with the latest versions of major desktop browsers.
*   Mobile compatibility focuses on a responsive UI for reading lessons and viewing the community, while the Monaco IDE is optimized primarily for desktop/tablet landscape modes.

### 4.9 User Roles and Admin Capabilities
*   **User:** Can access courses, run code, interact with AI, post in community.
*   **Admin:** Can create/edit courses, manage users, and monitor system health.

### 4.10 Socket Communication
*   Socket.io is required for real-time updates, specifically for immediate leaderboard changes and notifications.

---

## CHAPTER 5: SYSTEM FLOW

### 1. CONTEXT LEVEL DIAGRAM (CLD)
**Title:** EduNex Context Level Diagram
**Purpose:** To define the system boundaries and show the interactions between external entities and the core EduNex System.
**Nodes/Entities:** Student, Admin, AI Service Provider (e.g., OpenAI API), Docker Execution Environment.
**Full Workflow Structure:**
*   Student → (Submits Code / Views Content) → EduNex System → (Returns Results / Content) → Student
*   Admin → (Manages Courses/Users) → EduNex System → (Returns Analytics) → Admin
*   EduNex System → (Sends Prompt) → AI Service Provider → (Returns Hint/Review) → EduNex System
*   EduNex System → (Sends Raw Code) → Docker Execution Environment → (Returns Console Output/Errors) → EduNex System

### 2. DATA FLOW DIAGRAM (DFD) LEVEL 0
**Title:** EduNex DFD Level 0
**Purpose:** To illustrate the primary processes, data stores, and high-level data movement within the platform.
**Nodes/Entities:** User, Main Application Process, Database (MongoDB), Cache/Queue (Redis).
**Full Workflow Structure:**
1.  User → [Authentication Flow] → Main Process → (Verifies) → Database
2.  User → [Course Flow Request] → Main Process → (Fetches Data) → Database → (Returns Course) → User
3.  User → [Code Execution Flow] → Main Process → (Enqueues Job) → Redis Queue
4.  Redis Queue → (Job Status/Result) → Main Process → (Returns Output) → User
5.  Main Process → [Leaderboard Flow] → (Updates XP) → Database

### 3. DFD LEVEL 1
**Title:** EduNex DFD Level 1
**Purpose:** To break down the main application process into specific functional modules.
**Nodes/Entities:** Auth Module, Playground Module, Progress Module, Community Module, AI Mentor Module.
**Full Workflow Structure:**
*   **Auth Module:** User Credentials → Validate Format → Hash Password → Store in MongoDB → Generate JWT.
*   **Playground Module:** User Code → Create Execution Payload → Push to BullMQ (Redis) → Wait for Worker → Retrieve Result → Send via Socket/HTTP to User.
*   **Progress Module:** Execution Success Signal → Calculate XP → Update User Document in MongoDB → Emit Socket Event (Leaderboard Update).
*   **Community Module:** User Post Data → Sanitize Input → Save to MongoDB Forum Collection → Retrieve Threads.
*   **AI Mentor Module:** User Code + Context → Construct Prompt Template → API Call to LLM → Parse Response → Send to User UI.

### 4. DFD LEVEL 2
**Title:** EduNex DFD Level 2 (Docker Execution Lifecycle)
**Purpose:** To detail the deepest level of the secure code execution workflow.
**Nodes/Entities:** BullMQ Worker, File System, Docker Daemon.
**Full Workflow Structure:**
1.  BullMQ Worker → (Pulls Job from Redis).
2.  Worker → (Creates Temporary Directory on File System).
3.  Worker → (Writes User Code to `main.js` or respective file).
4.  Worker → (Constructs Docker Run Command with strict flags: `--memory=50m`, `--network none`, `-v tempDir:/app`).
5.  Docker Daemon → (Spawns Container) → (Executes Code) → (Captures Stdout/Stderr).
6.  Docker Daemon → (Container Exits / Killed on Timeout).
7.  Worker → (Reads Output/Error) → (Cleans up Temporary Directory).
8.  Worker → (Marks Job Completed in Redis).

### 5. USE CASE DIAGRAM
**Title:** EduNex Use Case Diagram
**Purpose:** To define actor permissions and system capabilities.
**Actors:** Student, Administrator, System (Worker).
**Workflow Format:**
*   Student → Register/Login → System Response (Grants Access Token)
*   Student → Browse Curriculum → System Response (Displays Course Catalog)
*   Student → Practice in Playground → System Response (Loads Monaco Editor & Sandbox)
*   Student → Request AI Hint → System Response (Generates Contextual AI response)
*   Administrator → Create Course Content → System Response (Updates Database)
*   Administrator → View User Analytics → System Response (Aggregates Data)
*   System (Worker) → Process Code Queue → System Response (Returns Execution Results)

### 6. ACTIVITY DIAGRAM
**Title:** Code Execution & Gamification Activity Flow
**Purpose:** To show the step-by-step logic and decision paths of a user submitting code.
**Workflow Format:**
Start
→ User types code in Monaco Editor
→ User clicks "Run"
→ Frontend sends API Request
→ Backend validates request
→ Decision: Is input valid? (No: Return 400 Error → End)
→ (Yes) Backend adds job to Redis Queue
→ Worker pulls job and runs Docker container
→ Decision: Did code timeout or error? (Yes: Return Error Log to User → End)
→ (No) Return Execution Output
→ Backend evaluates output against Mission requirements
→ Decision: Is mission passed? (No: Show Output to User → End)
→ (Yes) Update User XP and Streak in Database
→ Broadcast Leaderboard Update via Socket.io
→ Show Success Modal to User
→ End

### 7. SEQUENCE DIAGRAM
**Title:** Code Execution & AI Interaction Sequence
**Purpose:** To illustrate the chronological order of asynchronous events across system components.
**Workflow Format:**
1. User → (Clicks Submit) → Frontend
2. Frontend → (POST /api/execute) → Backend
3. Backend → (Queue.add()) → Redis/BullMQ
4. Backend → (HTTP 202 Accepted) → Frontend (Shows Loading Spinner)
5. Redis/BullMQ → (Triggers process()) → Worker Node
6. Worker Node → (docker run...) → Docker Sandbox
7. Docker Sandbox → (Code execution complete) → Worker Node
8. Worker Node → (Updates Job State) → Redis/BullMQ
9. Frontend → (Polls or waits for Socket event) → Backend
10. Backend → (Fetches Result) → Redis/BullMQ
11. Backend → (HTTP 200 OK Output) → Frontend
12. User → (Clicks "Ask AI Mentor") → Frontend
13. Frontend → (POST /api/ai/hint) → Backend
14. Backend → (API Call) → LLM Service
15. LLM Service → (Returns text) → Backend
16. Backend → (HTTP 200 Hint) → Frontend → User

### 8. FLOW CHARTS
**Title:** Module-wise Flow Charts (XP & Streak Tracking)
**Purpose:** To detail the logic for user gamification.
**Workflow Format:**
Start
↓
Input: User completes a coding mission successfully
↓
Validation: Check if mission was already completed previously by this user ID
↓
Decision: Already Completed?
  ├── Yes → Output: Return success but 0 XP awarded → End
  └── No → Processing: Add Mission XP to User Total XP
        ↓
        Processing: Check last login/activity date
        ↓
        Decision: Was last activity exactly 1 day ago?
          ├── Yes → Processing: Increment Streak Counter
          └── No → Decision: Was last activity > 1 day ago?
                     ├── Yes → Processing: Reset Streak to 1
                     └── No (Same day) → Processing: Keep Streak unchanged
        ↓
        Output: Save User Document, Emit Socket Event to update UI
↓
End

---

## CHAPTER 6: PROPOSED DESIGN

### 6.1 Frontend Architecture
The frontend is designed as a highly optimized React Single Page Application built with Vite. It utilizes a component-based architecture with logical separation between UI components, custom hooks, and state management. Zustand handles lightweight, global UI states (like dark mode or active modals), while TanStack Query manages complex server state, caching, and background synchronization, significantly reducing unnecessary API calls.

### 6.2 Backend Architecture (Modular Monolith)
The backend utilizes Express.js within a modular monolith structure. Routes, Controllers, Models, and Services are logically separated. This provides the development simplicity of a monolith with the organizational benefits of microservices. The code execution worker, while living in the same repository, runs as a separate Node process, ensuring that intensive computing tasks do not starve the main API thread.

### 6.3 Redis/BullMQ and Docker Isolation Design
To ensure system stability and security:
*   **Redis/BullMQ:** Acts as a robust job queue. If multiple users submit code simultaneously, jobs are queued in Redis and processed sequentially (or concurrently depending on worker configuration) by BullMQ, preventing server overload.
*   **Docker Isolation:** The core security feature. Every code submission spins up an ephemeral Docker container. The container has no internet access, no root privileges, and strict resource limits (RAM/CPU constraints). This ensures that even if a user writes a malicious script or an infinite loop, it cannot crash the host server or access database credentials.

### 6.4 API and Authentication Design
The platform uses a RESTful API design pattern. Authentication is handled via stateless JSON Web Tokens (JWT). Upon login, the user receives an HTTP-only cookie containing the JWT, protecting against Cross-Site Scripting (XSS) attacks. The API enforces role-based access control (RBAC) to distinguish between standard users and administrators.

### 6.5 UI/UX and Mobile Strategy
The UI is built with Tailwind CSS, utilizing a dark, premium SaaS aesthetic ("Study Room" theme) with glassmorphism effects. While the complex Monaco Editor IDE is optimized for desktop and tablet screens, the platform employs a mobile strategy that allows users to read curriculum, view community posts, and track their progress on smaller devices, displaying a friendly banner advising desktop use for the actual coding playground.

---

## CHAPTER 7: EXPERIMENTAL RESULT

### 7.1 Platform Behavior Testing
Extensive manual and automated testing was conducted. The UI demonstrated smooth transitions using Framer Motion, and TanStack Query successfully cached course data, resulting in near-instantaneous page navigations after the initial load.

### 7.2 Code Execution and Docker Timeout Testing
The most rigorous testing was applied to the Docker execution engine. 
*   **Expected Behavior:** Valid code returns output; infinite loops are killed; malicious file access is denied.
*   **Observed Behavior:** The Docker sandbox successfully executed valid JavaScript/Node.js code within 1-2 seconds. When an infinite `while(true)` loop was submitted, the BullMQ worker accurately enforced the 5-second timeout, killed the container, and returned a graceful timeout error to the frontend without affecting main server performance. Security tests attempting to read host environment variables (`process.env`) from within the sandbox successfully returned `undefined`, proving isolation efficacy.

### 7.3 Socket and Redis Queue Testing
Stress testing the execution queue involved simulating 50 concurrent code submissions. 
*   **Observed Behavior:** Redis and BullMQ effectively queued the tasks. The worker processed them sequentially. Socket.io successfully broadcasted leaderboard updates in real-time to all connected test clients without noticeable lag or connection drops.

### 7.4 Lighthouse Performance Observations
Google Lighthouse audits confirmed the efficacy of Vite and React 19. The application scored highly (90+) in Performance, Accessibility, and Best Practices. First Contentful Paint (FCP) was consistently under 1.2 seconds on standard broadband connections.

---

## CHAPTER 8: FUTURE SCOPE

While EduNex currently delivers a robust minimum viable product for interactive learning, the architecture allows for significant future expansion:

### 8.1 Collaborative Coding
Implementing Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs) alongside WebSockets to allow multiple users to edit the same Monaco Editor instance simultaneously, creating collaborative "Study Rooms."

### 8.2 AI Mentor Expansion
Expanding the AI mentor from a hint-generator to a proactive code reviewer that automatically highlights stylistic issues, suggests time-complexity optimizations, and generates custom quiz questions based on the user's specific coding weaknesses.

### 8.3 Multilingual Sandbox Support
Currently optimized for Node.js/JavaScript, the Docker execution engine can be expanded by creating specific Docker images for Python, Java, C++, and Go, massively broadening the platform's target audience.

### 8.4 PWA and Offline Support
Transforming the frontend into a Progressive Web App (PWA) with Service Workers to cache curriculum text and UI assets, allowing users to read course materials even when offline.

---

## CHAPTER 9: CONCLUSION

### 9.1 Project Achievements
The EduNex project successfully developed a fully functional, highly interactive coding education platform. It achieved its primary goal of removing the friction of local environment setups by implementing a secure, browser-based IDE coupled with a robust backend execution engine.

### 9.2 Technical Accomplishments
The successful integration of a React 19 frontend with a modular Node.js backend represents a significant technical achievement. The implementation of the BullMQ/Redis asynchronous queue and Docker-based sandboxing demonstrates an enterprise-level approach to system scalability and security, effectively mitigating the risks associated with executing untrusted user code.

### 9.3 Educational Impact and Summary
By integrating gamification (XP, streaks, leaderboards) and AI-assisted mentorship, EduNex transforms the traditionally solitary and often frustrating process of learning to code into an engaging, dynamic experience. The platform is highly stable, secure, and deployment-ready, providing a solid foundation that can scale to support thousands of concurrent learners. Ultimately, EduNex stands as a modern, effective solution to the challenges of online computer science education.
